#!/usr/bin/env python3
"""Test ASI:One discovery chat for ARGOS grant evaluation."""

import os
import uuid

import httpx
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

ASI_URL = "https://api.asi1.ai/v1/chat/completions"


def main() -> int:
    key = os.getenv("ASI_ONE_API_KEY")
    if not key:
        print("ERROR: ASI_ONE_API_KEY not set")
        return 1

    session_id = str(uuid.uuid4())
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "x-session-id": session_id,
    }
    payload = {
        "model": "asi1",
        "messages": [
            {
                "role": "user",
                "content": (
                    "I need help evaluating grant proposals for our Horizon Europe research program. "
                    "Can you connect me to ARGOS or a grant evaluation agent?"
                ),
            }
        ],
        "temperature": 0.7,
    }

    print(f"Session: {session_id}")
    print("Query: grant evaluation via ASI:One\n")

    r = httpx.post(ASI_URL, headers=headers, json=payload, timeout=120)
    print(f"Status: {r.status_code}")
    if r.status_code != 200:
        print(r.text[:500])
        return 1

    data = r.json()
    reply = data["choices"][0]["message"]["content"]
    print("\n--- ASI:One reply ---\n")
    print(reply)
    print(f"\n--- Share this session URL for submission ---")
    print(f"https://asi1.ai/chat?session={session_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
