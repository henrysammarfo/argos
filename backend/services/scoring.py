"""Aggregate scores and rank proposals."""

from typing import Any


def compute_weighted_score(
    technical: dict[str, Any],
    impact: dict[str, Any],
    team: dict[str, Any],
    rubric: dict[str, int],
) -> float:
    tech_avg = (
        technical.get("innovation", {}).get("score", 0)
        + technical.get("feasibility", {}).get("score", 0)
        + technical.get("methodology", {}).get("score", 0)
    ) / 3

    impact_avg = (
        impact.get("scale", {}).get("score", 0)
        + impact.get("sustainability", {}).get("score", 0)
        + impact.get("counterfactual", {}).get("score", 0)
    ) / 3

    team_avg = (
        team.get("track_record", {}).get("score", 0)
        + team.get("expertise", {}).get("score", 0)
        + team.get("risk_management", {}).get("score", 0)
    ) / 3

    total = (
        tech_avg * (rubric.get("technical", 33) / 100)
        + impact_avg * (rubric.get("impact", 34) / 100)
        + team_avg * (rubric.get("team", 33) / 100)
    )
    return round(total, 2)


def collect_red_flags(
    technical: dict[str, Any],
    impact: dict[str, Any],
    team: dict[str, Any],
) -> list[str]:
    flags: list[str] = []
    for block in (technical, impact, team):
        flags.extend(block.get("red_flags", []))
    return flags
