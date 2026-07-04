"""Optional SMTP email for verification codes."""

import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)


def smtp_configured() -> bool:
    return bool(os.getenv("SMTP_HOST") and os.getenv("SMTP_FROM"))


def send_verification_email(*, to_email: str, code: str, org_name: str) -> bool:
    """Send verification code. Returns True if sent, False if SMTP not configured."""
    host = os.getenv("SMTP_HOST", "")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER", "")
    password = os.getenv("SMTP_PASSWORD", "")
    from_addr = os.getenv("SMTP_FROM", "")
    use_tls = os.getenv("SMTP_TLS", "true").lower() in ("1", "true", "yes")

    if not host or not from_addr:
        logger.info("SMTP not configured — verification code not emailed")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Verify your ARGOS account — {org_name}"
    msg["From"] = from_addr
    msg["To"] = to_email

    text = (
        f"Welcome to ARGOS ({org_name}).\n\n"
        f"Your verification code: {code}\n\n"
        "Enter this in Settings → Account in the ARGOS console.\n"
    )
    html = f"""
    <html><body style="font-family:sans-serif">
    <h2>Verify your ARGOS account</h2>
    <p>Organization: <strong>{org_name}</strong></p>
    <p style="font-size:24px;letter-spacing:4px"><strong>{code}</strong></p>
    <p>Go to <strong>Settings → Account</strong> in the ARGOS console and enter this code.</p>
    </body></html>
    """
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(host, port, timeout=15) as server:
            if use_tls:
                server.starttls()
            if user and password:
                server.login(user, password)
            server.sendmail(from_addr, [to_email], msg.as_string())
        logger.info("Verification email sent to %s", to_email)
        return True
    except Exception:
        logger.exception("Failed to send verification email to %s", to_email)
        return False
