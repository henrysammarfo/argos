"""
OpenAI API calls for each evaluation dimension.
Async-safe with JSON extraction from markdown fences.
"""

import asyncio
import json
import os
import re
from typing import Any

from openai import OpenAI

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")
        _client = OpenAI(api_key=api_key)
    return _client


def extract_json(text: str) -> dict[str, Any]:
    """Parse JSON from model response, handling markdown fences."""
    text = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        brace = re.search(r"\{[\s\S]*\}", text)
        if brace:
            return json.loads(brace.group())
        raise


async def _call_openai(system: str, user: str, max_tokens: int = 800) -> dict[str, Any]:
    client = _get_client()

    def _sync_call() -> dict[str, Any]:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system + "\n\nRespond with valid JSON only."},
                {"role": "user", "content": user},
            ],
        )
        text = response.choices[0].message.content or "{}"
        return extract_json(text)

    return await asyncio.to_thread(_sync_call)


async def evaluate_technical_merit(proposal_text: str, rubric_weight: int = 30) -> dict[str, Any]:
    system = """You are a senior grant evaluator specializing in technical assessment.
Evaluate TECHNICAL MERIT on three dimensions (1-10 each):
1. INNOVATION: How novel is this approach?
2. FEASIBILITY: Is the plan realistic?
3. METHODOLOGY: Is the approach clearly defined?

For EACH dimension give score 1-10 and 2-3 sentences reasoning citing SPECIFIC text.
List RED FLAGS (technical risks, missing information, overclaims).

Return JSON:
{
  "innovation": {"score": 0, "reasoning": "..."},
  "feasibility": {"score": 0, "reasoning": "..."},
  "methodology": {"score": 0, "reasoning": "..."},
  "red_flags": ["...", "..."]
}"""
    return await _call_openai(system, f"Grant proposal to evaluate:\n\n{proposal_text}")


async def evaluate_impact(proposal_text: str, rubric_weight: int = 40) -> dict[str, Any]:
    system = """You are a senior grant evaluator specializing in impact assessment.
Evaluate POTENTIAL IMPACT on three dimensions (1-10 each):
1. SCALE: How many people/systems affected?
2. SUSTAINABILITY: Will impact persist after grant ends?
3. COUNTERFACTUAL: Would this happen without the grant?

Return JSON:
{
  "scale": {"score": 0, "reasoning": "..."},
  "sustainability": {"score": 0, "reasoning": "..."},
  "counterfactual": {"score": 0, "reasoning": "..."},
  "red_flags": ["...", "..."]
}"""
    return await _call_openai(system, f"Grant proposal to evaluate:\n\n{proposal_text}")


async def evaluate_team(proposal_text: str, rubric_weight: int = 30) -> dict[str, Any]:
    system = """You are a senior grant evaluator specializing in team assessment.
Evaluate TEAM QUALITY on three dimensions (1-10 each):
1. TRACK_RECORD: Relevant prior experience?
2. EXPERTISE: Right skills for this work?
3. RISK_MANAGEMENT: Team risks identified?

Return JSON:
{
  "track_record": {"score": 0, "reasoning": "..."},
  "expertise": {"score": 0, "reasoning": "..."},
  "risk_management": {"score": 0, "reasoning": "..."},
  "red_flags": ["...", "..."]
}"""
    return await _call_openai(system, f"Grant proposal to evaluate:\n\n{proposal_text}")


async def extract_proposal_structure(proposal_text: str) -> dict[str, Any]:
    system = """Extract structured information from this grant proposal.
Return JSON:
{
  "title": "project title",
  "team_summary": "who is applying (2-3 sentences)",
  "objectives": "main goals (2-3 sentences)",
  "methodology": "how they plan to do it (2-3 sentences)",
  "budget_requested": "amount and currency if stated",
  "timeline": "project duration if stated",
  "target_beneficiaries": "who benefits"
}"""
    return await _call_openai(system, f"Grant proposal:\n\n{proposal_text[:4000]}", max_tokens=500)


async def verify_milestone(report_text: str, promised_deliverables: list[str]) -> dict[str, Any]:
    deliverables_text = "\n".join(f"- {d}" for d in promised_deliverables)
    system = f"""You are a grant milestone auditor. Promised deliverables:
{deliverables_text}

Review the progress report. Return JSON:
{{
  "verdict": "complete|partial|missed",
  "completion_pct": 0,
  "evidence": [{{"claim": "...", "verified": true, "quote": "..."}}],
  "gaps": ["gap1"]
}}"""
    return await _call_openai(system, f"Progress report:\n\n{report_text}")


async def generate_comparison(proposals_summary: list[dict[str, Any]], rubric: dict[str, int]) -> str:
    client = _get_client()
    summary_text = json.dumps(proposals_summary, indent=2)

    def _sync_call() -> str:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=600,
            messages=[
                {
                    "role": "system",
                    "content": "You are a grant committee chair explaining evaluation results.",
                },
                {
                    "role": "user",
                    "content": f"""Write a concise comparison of top-ranked proposals (<300 words).
Rubric: {json.dumps(rubric)}
Proposals: {summary_text}""",
                },
            ],
        )
        return response.choices[0].message.content or ""

    return await asyncio.to_thread(_sync_call)
