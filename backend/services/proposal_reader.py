"""Extract clean text from proposal sources: PDF, URL, or raw text."""

import fitz  # PyMuPDF
import httpx
from bs4 import BeautifulSoup
from markdownify import markdownify


async def read_proposal(source_type: str, source: str) -> str:
    if source_type == "pdf":
        return _read_pdf(source)
    if source_type == "url":
        return await _read_url(source)
    if source_type == "text":
        return source
    raise ValueError(f"Unknown source type: {source_type}")


def _read_pdf(filepath: str) -> str:
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    return "\n".join(lines)


async def _read_url(url: str) -> str:
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        response = await client.get(
            url,
            headers={"User-Agent": "ARGOS/1.0 Grant Evaluation System"},
        )
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    main = soup.find("main") or soup.find("article") or soup.find("body")
    html_content = str(main) if main else str(soup)
    return markdownify(html_content, heading_style="ATX")


def truncate_for_evaluation(text: str, max_chars: int = 8000) -> str:
    if len(text) <= max_chars:
        return text
    half = max_chars // 2
    return text[:half] + "\n\n[...middle sections truncated...]\n\n" + text[-half:]
