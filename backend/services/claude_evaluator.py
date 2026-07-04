"""Backward-compatible shim — all evaluation now uses OpenAI."""

from services.openai_evaluator import (
    evaluate_impact,
    evaluate_team,
    evaluate_technical_merit,
    extract_proposal_structure,
    generate_comparison,
    verify_milestone,
)

__all__ = [
    "evaluate_technical_merit",
    "evaluate_impact",
    "evaluate_team",
    "extract_proposal_structure",
    "verify_milestone",
    "generate_comparison",
]
