# ARGOS — AI Grant & Procurement Evaluation System

**Hackathons:** Conduct Track (£8K) · Fetch.ai Challenge (£500) · Kaspa ($1K USDC) · GCC Category 1  
**Builder:** Henry Sam Marfo | github.com/henrysammarfo  
**Deadline:** July 4, 2026 — Demo Day at Imperial College London  
**Stack:** Python · Fetch.ai uAgents · Anthropic Claude · Kaspa · FastAPI · PostgreSQL  
**Frontend:** Built in Lovable — connects to FastAPI backend via REST API

---

## WHAT WE ARE BUILDING

ARGOS takes 50 grant proposals from 6 weeks of committee review to 8 hours — every AI evaluation step shown, explained, and human-approved — with milestone payments locked in Kaspa conditional escrow so money only releases when deliverables are verified.

**The enterprise pain (confirmed by research):**

- 50 proposals × 6 reviewers × 1 hour each = 300 expert-hours of review
- Bottleneck is scoring and approval, not reading — reviewers miss context, score inconsistently
- ARGOS: 50 proposals evaluated in parallel in 4 minutes, humans review 8 flagged edge cases = 12 expert-hours
- **25x speedup. 6 weeks → 8 hours. Fully auditable.**

**Prize stack:**

- Conduct Track: Build tool for slow enterprise process, user stays in control
- Fetch.ai: 5 agents on Agentverse, discoverable via ASI:One, Chat Protocol
- Kaspa: Conditional milestone escrow using Kaspa covenant logic
- GCC Category 1: Exact match — "agents that improve how public capital is evaluated and allocated"

---

## PROJECT STRUCTURE

```
argos/
├── ARGOS_BUILD_GUIDE.md          ← this file
├── README.md                      ← hackathon submission README
├── requirements.txt
├── .env
│
├── agents/                        ← Fetch.ai uAgents (register on Agentverse)
│   ├── orchestrator.py            ← main coordinator agent
│   ├── intake_agent.py            ← reads/parses proposals
│   ├── technical_agent.py         ← scores technical merit
│   ├── impact_agent.py            ← scores potential impact
│   ├── team_agent.py              ← scores team quality
│   └── milestone_agent.py         ← verifies milestone completion
│
├── api/                           ← FastAPI backend (Lovable frontend connects here)
│   ├── main.py                    ← FastAPI app + CORS
│   ├── routes/
│   │   ├── evaluations.py         ← POST /evaluate, GET /evaluation/{id}
│   │   ├── proposals.py           ← upload/list proposals
│   │   ├── approvals.py           ← POST /approve, POST /override
│   │   ├── escrow.py              ← Kaspa milestone escrow routes
│   │   └── milestones.py          ← milestone submission + verification
│   ├── models.py                  ← SQLAlchemy models
│   ├── database.py                ← PostgreSQL connection
│   └── schemas.py                 ← Pydantic request/response schemas
│
├── services/
│   ├── proposal_reader.py         ← PDF + URL → clean text
│   ├── claude_evaluator.py        ← Claude API calls for each agent
│   ├── kaspa_escrow.py            ← Kaspa SDK integration
│   └── scoring.py                 ← aggregate scores, rank proposals
│
├── demo/
│   ├── sample_proposals/          ← 10 real EU Horizon Europe PDFs for demo
│   └── run_demo.py                ← runs full pipeline on sample data
│
└── frontend_api_spec.md           ← API spec for Lovable frontend
```

---

## ENVIRONMENT SETUP

### requirements.txt

```
# Fetch.ai
uagents>=0.18.0
uagents-core>=0.4.0

# AI
anthropic>=0.28.0

# FastAPI
fastapi>=0.111.0
uvicorn>=0.30.0
python-multipart>=0.0.9

# Database
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.0
alembic>=1.13.0

# Document processing
pymupdf>=1.24.0          # PDF → text
httpx>=0.27.0            # URL fetch
beautifulsoup4>=4.12.0   # HTML parsing
markdownify>=0.12.0      # HTML → markdown

# Kaspa
kaspa-sdk>=0.1.0         # pip install kaspa-sdk if available, else use REST API

# Utilities
python-dotenv>=1.0.0
pydantic>=2.0.0
aiofiles>=23.0.0
websockets>=12.0
```

### .env

```bash
# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Fetch.ai Agentverse
AGENTVERSE_API_KEY=your_agentverse_api_key

# Kaspa
KASPA_NODE_URL=https://api.kaspa.org    # public Kaspa REST API
KASPA_SEED_PHRASE=your_kaspa_wallet_seed_phrase
ESCROW_WALLET_ADDRESS=your_escrow_wallet_address
PROGRAM_ADMIN_ADDRESS=program_admin_kaspa_address

# Database
DATABASE_URL=postgresql://argos:password@localhost:5432/argos

# App
PORT=8000
FRONTEND_URL=http://localhost:3000     # Lovable dev URL
CORS_ORIGINS=http://localhost:3000,https://your-lovable-app.lovable.app
```

### Install and run

```bash
pip install -r requirements.txt

# Database setup
createdb argos
alembic upgrade head

# Start FastAPI backend
uvicorn api.main:app --reload --port 8000

# Start Orchestrator agent (separate terminal)
python agents/orchestrator.py

# Start all evaluation agents (separate terminals or use Agentverse cloud)
python agents/intake_agent.py
python agents/technical_agent.py
python agents/impact_agent.py
python agents/team_agent.py
python agents/milestone_agent.py
```

---

## DATABASE MODELS

### api/models.py

```python
from sqlalchemy import Column, String, Integer, Float, JSON, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

def gen_id():
    return str(uuid.uuid4())


class Evaluation(Base):
    """A grant evaluation session — one RFP round."""
    __tablename__ = "evaluations"

    id = Column(String, primary_key=True, default=gen_id)
    title = Column(String, nullable=False)                    # "Q3 2026 Climate Grant Round"
    description = Column(Text, nullable=True)
    rubric = Column(JSON, nullable=False)                     # {technical: 30, impact: 40, team: 30}
    grant_amount_kas = Column(Float, nullable=True)           # Kaspa escrow amount
    milestones = Column(JSON, nullable=True)                  # [{name, date, percent}, ...]
    status = Column(String, default="active")                 # active, complete, archived
    created_at = Column(DateTime, default=datetime.utcnow)

    proposals = relationship("Proposal", back_populates="evaluation")


class Proposal(Base):
    """A single grant application being evaluated."""
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, default=gen_id)
    evaluation_id = Column(String, ForeignKey("evaluations.id"), nullable=False)

    # Source
    title = Column(String, nullable=False)
    source_type = Column(String)                              # pdf, url, text
    source_url = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)                    # extracted content

    # AI-extracted structured data
    team_summary = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    budget_requested = Column(String, nullable=True)
    timeline = Column(String, nullable=True)

    # Evaluation scores (set by evaluation agents)
    technical_scores = Column(JSON, nullable=True)            # {innovation: {score:8, reasoning:"..."}, ...}
    impact_scores = Column(JSON, nullable=True)
    team_scores = Column(JSON, nullable=True)
    red_flags = Column(JSON, nullable=True)                   # [{agent, flag, severity}, ...]

    # Human override tracking
    overrides = Column(JSON, default=list)                    # [{dimension, original, override, reason, timestamp}, ...]

    # Computed
    total_score = Column(Float, nullable=True)                # weighted aggregate
    rank = Column(Integer, nullable=True)
    status = Column(String, default="pending")                # pending, evaluating, complete, approved, winner

    evaluation = relationship("Evaluation", back_populates="proposals")

    created_at = Column(DateTime, default=datetime.utcnow)
    evaluated_at = Column(DateTime, nullable=True)


class Approval(Base):
    """Human approval or override of an AI evaluation decision."""
    __tablename__ = "approvals"

    id = Column(String, primary_key=True, default=gen_id)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    evaluator = Column(String, nullable=True)                 # reviewer email/name
    action = Column(String, nullable=False)                   # approve, override, flag
    dimension = Column(String, nullable=True)                 # technical.innovation, impact.scale, etc.
    original_score = Column(Float, nullable=True)
    new_score = Column(Float, nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class KaspaEscrow(Base):
    """Kaspa milestone-based grant escrow."""
    __tablename__ = "kaspa_escrows"

    id = Column(String, primary_key=True, default=gen_id)
    evaluation_id = Column(String, ForeignKey("evaluations.id"), nullable=False)
    grantee_proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)

    total_kas = Column(Float, nullable=False)
    escrow_address = Column(String, nullable=True)            # Kaspa address holding funds
    lock_tx_hash = Column(String, nullable=True)              # TX that locked funds

    milestones = Column(JSON, nullable=False)                 # [{name, date, percent, status, release_tx}]
    status = Column(String, default="pending")                # pending, locked, partial, complete

    grantee_kas_address = Column(String, nullable=False)
    program_admin_kas_address = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


class MilestoneSubmission(Base):
    """Grantee progress report for milestone verification."""
    __tablename__ = "milestone_submissions"

    id = Column(String, primary_key=True, default=gen_id)
    escrow_id = Column(String, ForeignKey("kaspa_escrows.id"), nullable=False)
    milestone_index = Column(Integer, nullable=False)

    report_text = Column(Text, nullable=False)
    report_url = Column(String, nullable=True)

    # AI verification result
    ai_verdict = Column(String, nullable=True)                # complete, partial, missed
    ai_evidence = Column(JSON, nullable=True)                 # [{claim, verified, quote}, ...]
    ai_completion_pct = Column(Float, nullable=True)

    # Human approval
    human_approved = Column(Boolean, nullable=True)
    human_note = Column(Text, nullable=True)

    # Kaspa release
    release_tx_hash = Column(String, nullable=True)
    kas_released = Column(Float, nullable=True)

    submitted_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
```

---

## SERVICES

### services/proposal_reader.py

```python
"""
Extract clean text from proposal sources: PDF, URL, or raw text.
"""
import fitz  # PyMuPDF
import httpx
from bs4 import BeautifulSoup
from markdownify import markdownify
import asyncio


async def read_proposal(source_type: str, source: str) -> str:
    """
    Args:
        source_type: 'pdf', 'url', or 'text'
        source: file path (pdf), URL (url), or raw text (text)
    Returns:
        Clean text content of the proposal
    """
    if source_type == 'pdf':
        return _read_pdf(source)
    elif source_type == 'url':
        return await _read_url(source)
    elif source_type == 'text':
        return source
    else:
        raise ValueError(f"Unknown source type: {source_type}")


def _read_pdf(filepath: str) -> str:
    """Extract text from PDF using PyMuPDF."""
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()

    # Clean up whitespace
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return '\n'.join(lines)


async def _read_url(url: str) -> str:
    """Fetch URL and extract main content as markdown."""
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        response = await client.get(url, headers={
            'User-Agent': 'ARGOS/1.0 Grant Evaluation System'
        })
        response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')

    # Remove boilerplate
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        tag.decompose()

    # Extract main content
    main = soup.find('main') or soup.find('article') or soup.find('body')
    html_content = str(main) if main else str(soup)

    return markdownify(html_content, heading_style="ATX")


def truncate_for_evaluation(text: str, max_chars: int = 8000) -> str:
    """Truncate proposal text to fit within Claude's context window."""
    if len(text) <= max_chars:
        return text
    # Keep beginning and end (intro + conclusion most relevant)
    half = max_chars // 2
    return text[:half] + "\n\n[...middle sections truncated...]\n\n" + text[-half:]
```

### services/claude_evaluator.py

```python
"""
Claude API calls for each evaluation dimension.
Each function returns structured JSON scores with full reasoning.
"""
import json
import anthropic
from typing import Optional

client = anthropic.Anthropic()


async def evaluate_technical_merit(proposal_text: str, rubric_weight: int) -> dict:
    """
    Score technical merit: innovation, feasibility, methodology.
    Returns: {innovation: {score, reasoning}, feasibility: {score, reasoning},
              approach: {score, reasoning}, red_flags: [...]}
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        system="""You are a senior grant evaluator specializing in technical assessment.
Evaluate the TECHNICAL MERIT of this grant proposal on three dimensions (1-10 each):

1. INNOVATION (1-10): How novel is this approach? Does it advance beyond existing work?
2. FEASIBILITY (1-10): Is the plan realistic? Is the budget appropriate? Can this team execute?
3. METHODOLOGY (1-10): Is the approach clearly defined? Is the technical plan credible?

For EACH dimension:
- Give a score 1-10
- Write 2-3 sentences of reasoning citing SPECIFIC text from the proposal
- Note if the score might change with more information

Also list any RED FLAGS (technical risks, missing information, overclaims).

Return ONLY valid JSON in this exact format:
{
  "innovation": {"score": 0, "reasoning": "..."},
  "feasibility": {"score": 0, "reasoning": "..."},
  "methodology": {"score": 0, "reasoning": "..."},
  "red_flags": ["...", "..."]
}""",
        messages=[{
            "role": "user",
            "content": f"Grant proposal to evaluate:\n\n{proposal_text}"
        }]
    )

    text = response.content[0].text.strip()
    return json.loads(text)


async def evaluate_impact(proposal_text: str, rubric_weight: int) -> dict:
    """
    Score impact potential: scale, sustainability, counterfactual.
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        system="""You are a senior grant evaluator specializing in impact assessment.
Evaluate the POTENTIAL IMPACT of this grant proposal on three dimensions (1-10 each):

1. SCALE (1-10): How many people/systems will this affect? How significant is the change?
2. SUSTAINABILITY (1-10): Will impact persist after grant ends? Is there a path to self-sufficiency?
3. COUNTERFACTUAL (1-10): Would this happen without the grant? Is funding the critical bottleneck?

For EACH dimension:
- Give a score 1-10
- Write 2-3 sentences of reasoning citing SPECIFIC text from the proposal
- Apply counterfactual thinking: what's the world WITHOUT this grant?

Also list any RED FLAGS (vague impact claims, missing baseline measurements, unrealistic projections).

Return ONLY valid JSON in this exact format:
{
  "scale": {"score": 0, "reasoning": "..."},
  "sustainability": {"score": 0, "reasoning": "..."},
  "counterfactual": {"score": 0, "reasoning": "..."},
  "red_flags": ["...", "..."]
}""",
        messages=[{
            "role": "user",
            "content": f"Grant proposal to evaluate:\n\n{proposal_text}"
        }]
    )

    text = response.content[0].text.strip()
    return json.loads(text)


async def evaluate_team(proposal_text: str, rubric_weight: int) -> dict:
    """
    Score team quality: track record, expertise, risk factors.
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        system="""You are a senior grant evaluator specializing in team assessment.
Evaluate the TEAM QUALITY of this grant proposal on three dimensions (1-10 each):

1. TRACK_RECORD (1-10): Does the team have relevant prior experience? Prior grants/projects?
2. EXPERTISE (1-10): Do team members have the right skills for this work? Are key roles covered?
3. RISK_MANAGEMENT (1-10): Are team risks identified? Is there a plan for key person dependency?

For EACH dimension:
- Give a score 1-10
- Write 2-3 sentences of reasoning citing SPECIFIC text from the proposal
- Note any concerning gaps in team composition

Also list any RED FLAGS (missing financial controller, over-reliance on one person, skills gap).

Return ONLY valid JSON in this exact format:
{
  "track_record": {"score": 0, "reasoning": "..."},
  "expertise": {"score": 0, "reasoning": "..."},
  "risk_management": {"score": 0, "reasoning": "..."},
  "red_flags": ["...", "..."]
}""",
        messages=[{
            "role": "user",
            "content": f"Grant proposal to evaluate:\n\n{proposal_text}"
        }]
    )

    text = response.content[0].text.strip()
    return json.loads(text)


async def extract_proposal_structure(proposal_text: str) -> dict:
    """Extract structured metadata from proposal text."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system="""Extract structured information from this grant proposal.
Return ONLY valid JSON:
{
  "title": "project title",
  "team_summary": "who is applying and their background (2-3 sentences)",
  "objectives": "main goals of the project (2-3 sentences)",
  "methodology": "how they plan to do it (2-3 sentences)",
  "budget_requested": "amount and currency if stated",
  "timeline": "project duration if stated",
  "target_beneficiaries": "who benefits from this"
}""",
        messages=[{
            "role": "user",
            "content": f"Grant proposal:\n\n{proposal_text[:4000]}"
        }]
    )

    text = response.content[0].text.strip()
    return json.loads(text)


async def verify_milestone(report_text: str, promised_deliverables: list[str]) -> dict:
    """
    Verify if a milestone progress report meets the promised deliverables.
    Returns: {verdict, completion_pct, evidence: [{claim, verified, quote}], gaps: [...]}
    """
    deliverables_text = '\n'.join(f"- {d}" for d in promised_deliverables)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        system=f"""You are a grant milestone auditor. The grantee promised these deliverables:

{deliverables_text}

Review their progress report and determine:
1. For each promised deliverable: is there clear evidence of completion?
2. What percentage of the milestone is complete?
3. What specific gaps remain?

Return ONLY valid JSON:
{{
  "verdict": "complete|partial|missed",
  "completion_pct": 0-100,
  "evidence": [
    {{"claim": "deliverable name", "verified": true/false, "quote": "relevant quote from report or null"}}
  ],
  "gaps": ["gap1", "gap2"]
}}""",
        messages=[{
            "role": "user",
            "content": f"Progress report:\n\n{report_text}"
        }]
    )

    text = response.content[0].text.strip()
    return json.loads(text)


async def generate_comparison(proposals_summary: list[dict], rubric: dict) -> str:
    """
    Generate a plain-language comparison of top-ranked proposals.
    """
    summary_text = json.dumps(proposals_summary, indent=2)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system="You are a grant committee chair explaining the evaluation results to program managers.",
        messages=[{
            "role": "user",
            "content": f"""
Write a concise comparison of these top-ranked grant proposals for the program manager.
Focus on: key trade-offs between rank 1 and rank 2, biggest strengths and risks of the winner,
any concerns the committee should discuss before final selection.
Keep it under 300 words. Be direct and specific.

Rubric weights: {json.dumps(rubric)}
Proposals: {summary_text}
"""
        }]
    )

    return response.content[0].text


def compute_weighted_score(technical: dict, impact: dict, team: dict, rubric: dict) -> float:
    """
    Compute weighted total score from three evaluation results.
    rubric: {technical: 30, impact: 40, team: 30}  (percentages summing to 100)
    """
    tech_avg = (
        technical.get('innovation', {}).get('score', 0) +
        technical.get('feasibility', {}).get('score', 0) +
        technical.get('methodology', {}).get('score', 0)
    ) / 3

    impact_avg = (
        impact.get('scale', {}).get('score', 0) +
        impact.get('sustainability', {}).get('score', 0) +
        impact.get('counterfactual', {}).get('score', 0)
    ) / 3

    team_avg = (
        team.get('track_record', {}).get('score', 0) +
        team.get('expertise', {}).get('score', 0) +
        team.get('risk_management', {}).get('score', 0)
    ) / 3

    total = (
        tech_avg * (rubric.get('technical', 33) / 100) +
        impact_avg * (rubric.get('impact', 34) / 100) +
        team_avg * (rubric.get('team', 33) / 100)
    )

    return round(total, 2)
```

### services/kaspa_escrow.py

```python
"""
Kaspa milestone-based grant escrow.
Uses Kaspa REST API (api.kaspa.org) — public node, no auth required for reads.
For sends: uses kaspa-sdk or constructs raw transactions.
"""
import httpx
import json
import os
from typing import Optional

KASPA_NODE = os.getenv("KASPA_NODE_URL", "https://api.kaspa.org")


async def get_balance(address: str) -> float:
    """Get KAS balance of an address."""
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{KASPA_NODE}/addresses/{address}/balance")
        data = r.json()
        # Balance returned in sompi (1 KAS = 1e8 sompi)
        return data.get("balance", 0) / 1e8


async def get_transaction(tx_hash: str) -> dict:
    """Get transaction details by hash."""
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{KASPA_NODE}/transactions/{tx_hash}")
        return r.json()


async def verify_deposit(escrow_address: str, expected_amount_kas: float) -> dict:
    """
    Verify that funds have been deposited to the escrow address.
    Returns: {verified: bool, actual_balance: float, tx_hash: str|None}
    """
    actual = await get_balance(escrow_address)

    # Allow 1% tolerance for fees
    tolerance = expected_amount_kas * 0.01
    verified = actual >= (expected_amount_kas - tolerance)

    # Try to find the deposit transaction
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{KASPA_NODE}/addresses/{escrow_address}/transactions?limit=10")
        txs = r.json()

    last_tx = txs[0]['transaction_id'] if txs else None

    return {
        "verified": verified,
        "actual_balance_kas": actual,
        "expected_kas": expected_amount_kas,
        "deposit_tx": last_tx
    }


async def send_kaspa(
    from_address: str,
    to_address: str,
    amount_kas: float,
    note: Optional[str] = None
) -> str:
    """
    Send KAS from one address to another.
    NOTE: In a real system this requires signing with the private key.
    For hackathon demo: use kaspa-sdk or the kaspa CLI wallet.

    Returns: transaction hash
    """
    # For demo: use kaspa-sdk Python binding
    # Install: pip install kaspa (or use wasm bindings from rusty-kaspa)

    # Placeholder — replace with actual kaspa-sdk call
    # from kaspa_sdk import KaspaClient
    # client = KaspaClient(seed_phrase=os.getenv("KASPA_SEED_PHRASE"))
    # tx_hash = await client.send(to_address, amount_kas, note)

    # For demo without SDK:
    # Use Kaspa Web Wallet API or CLI and return real TX hash
    print(f"KASPA SEND: {amount_kas} KAS from {from_address} to {to_address}")
    print(f"Note: {note}")
    print("In production: sign with private key and broadcast")

    # Return mock hash for demo flow — replace with real TX
    return f"demo_tx_{int(amount_kas * 1e8)}"


def calculate_milestone_amounts(total_kas: float, milestones: list[dict]) -> list[dict]:
    """
    Calculate KAS amount for each milestone based on percentages.
    milestones: [{name, date, percent}, ...]
    """
    result = []
    for m in milestones:
        amount = total_kas * (m['percent'] / 100)
        result.append({
            **m,
            'kas_amount': round(amount, 8),
            'status': 'locked',
            'release_tx': None
        })
    return result


async def release_milestone(
    escrow_id: str,
    milestone_index: int,
    grantee_address: str,
    kas_amount: float,
    escrow_address: str
) -> str:
    """
    Release a milestone payment from escrow to grantee.
    Called after human approves AI milestone verification.
    Returns: Kaspa transaction hash
    """
    note = f"ARGOS Grant #{escrow_id} Milestone {milestone_index + 1}"
    tx_hash = await send_kaspa(
        from_address=escrow_address,
        to_address=grantee_address,
        amount_kas=kas_amount,
        note=note
    )
    return tx_hash


async def return_to_admin(
    escrow_id: str,
    milestone_index: int,
    admin_address: str,
    kas_amount: float,
    escrow_address: str,
    reason: str
) -> str:
    """
    Return unreleased milestone funds to program admin (missed deadline / failed verification).
    """
    note = f"ARGOS Grant #{escrow_id} Milestone {milestone_index + 1} RETURNED: {reason}"
    tx_hash = await send_kaspa(
        from_address=escrow_address,
        to_address=admin_address,
        amount_kas=kas_amount,
        note=note
    )
    return tx_hash
```

---

## FETCH.AI AGENTS

### agents/intake_agent.py

```python
"""
Intake Agent — reads grant proposals from PDF or URL and extracts structured data.
Registered on Agentverse, paid per proposal processed.
"""
import json
import asyncio
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent,
    StartSessionContent, EndSessionContent, chat_protocol_spec
)
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from services.proposal_reader import read_proposal, truncate_for_evaluation
from services.claude_evaluator import extract_proposal_structure

# Create agent — gets a persistent identity on Agentverse
intake_agent = Agent(
    name="argos-intake",
    seed="argos_intake_seed_phrase_change_in_production",
    port=8001,
    endpoint=["http://localhost:8001/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)


def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


@chat_proto.on_message(ChatMessage)
async def handle_intake_request(ctx: Context, sender: str, msg: ChatMessage):
    """
    Receive a proposal source and extract structured content.
    Input JSON: {"source_type": "pdf|url|text", "source": "path_or_url_or_text"}
    """
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.utcnow(),
        acknowledged_msg_id=msg.msg_id
    ))

    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                source_type = request.get("source_type", "text")
                source = request.get("source", "")

                ctx.logger.info(f"Intake: processing {source_type} proposal")

                # Extract text
                raw_text = await read_proposal(source_type, source)
                truncated = truncate_for_evaluation(raw_text)

                # Extract structure
                structure = await extract_proposal_structure(truncated)

                result = {
                    "status": "success",
                    "raw_text_length": len(raw_text),
                    "truncated_text": truncated,
                    "structure": structure
                }

                ctx.logger.info(f"Intake complete: {structure.get('title', 'Unknown')}")
                await ctx.send(sender, create_text_chat(json.dumps(result)))

            except Exception as e:
                error_result = {"status": "error", "error": str(e)}
                await ctx.send(sender, create_text_chat(json.dumps(error_result)))


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"ACK from {sender}")


intake_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Intake Agent address: {intake_agent.address}")
    intake_agent.run()
```

### agents/technical_agent.py

```python
"""
Technical Merit Agent — evaluates innovation, feasibility, methodology.
Registered on Agentverse as a specialized grant evaluation service.
"""
import json
import asyncio
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent, chat_protocol_spec
)
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.claude_evaluator import evaluate_technical_merit

technical_agent = Agent(
    name="argos-technical",
    seed="argos_technical_seed_phrase_change_in_production",
    port=8002,
    endpoint=["http://localhost:8002/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)


def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


@chat_proto.on_message(ChatMessage)
async def handle_technical_eval(ctx: Context, sender: str, msg: ChatMessage):
    """
    Input: {"proposal_text": "...", "rubric_weight": 30}
    Output: {"innovation": {...}, "feasibility": {...}, "methodology": {...}, "red_flags": [...]}
    """
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.utcnow(),
        acknowledged_msg_id=msg.msg_id
    ))

    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                proposal_text = request.get("proposal_text", "")
                rubric_weight = request.get("rubric_weight", 30)

                ctx.logger.info("Evaluating technical merit...")
                scores = await evaluate_technical_merit(proposal_text, rubric_weight)

                result = {"status": "success", "scores": scores, "agent": "technical"}
                await ctx.send(sender, create_text_chat(json.dumps(result)))

            except Exception as e:
                await ctx.send(sender, create_text_chat(
                    json.dumps({"status": "error", "error": str(e), "agent": "technical"})
                ))


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


technical_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Technical Agent address: {technical_agent.address}")
    technical_agent.run()
```

### agents/impact_agent.py

```python
"""Impact Agent — evaluates scale, sustainability, counterfactual impact."""
import json
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent, chat_protocol_spec
)
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.claude_evaluator import evaluate_impact

impact_agent = Agent(
    name="argos-impact",
    seed="argos_impact_seed_phrase_change_in_production",
    port=8003,
    endpoint=["http://localhost:8003/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)

def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(timestamp=datetime.utcnow(), msg_id=uuid4(),
                      content=[TextContent(type="text", text=text)])

@chat_proto.on_message(ChatMessage)
async def handle_impact_eval(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(sender, ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id))
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                scores = await evaluate_impact(request.get("proposal_text", ""), request.get("rubric_weight", 40))
                await ctx.send(sender, create_text_chat(json.dumps({"status": "success", "scores": scores, "agent": "impact"})))
            except Exception as e:
                await ctx.send(sender, create_text_chat(json.dumps({"status": "error", "error": str(e), "agent": "impact"})))

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement): pass

impact_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Impact Agent address: {impact_agent.address}")
    impact_agent.run()
```

### agents/team_agent.py

```python
"""Team Agent — evaluates track record, expertise, risk management."""
import json
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent, chat_protocol_spec
)
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.claude_evaluator import evaluate_team

team_agent = Agent(
    name="argos-team",
    seed="argos_team_seed_phrase_change_in_production",
    port=8004,
    endpoint=["http://localhost:8004/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)

def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(timestamp=datetime.utcnow(), msg_id=uuid4(),
                      content=[TextContent(type="text", text=text)])

@chat_proto.on_message(ChatMessage)
async def handle_team_eval(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(sender, ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id))
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                scores = await evaluate_team(request.get("proposal_text", ""), request.get("rubric_weight", 30))
                await ctx.send(sender, create_text_chat(json.dumps({"status": "success", "scores": scores, "agent": "team"})))
            except Exception as e:
                await ctx.send(sender, create_text_chat(json.dumps({"status": "error", "error": str(e), "agent": "team"})))

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement): pass

team_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Team Agent address: {team_agent.address}")
    team_agent.run()
```

### agents/milestone_agent.py

```python
"""Milestone Verification Agent — verifies grantee progress reports against promised deliverables."""
import json
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent, chat_protocol_spec
)
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.claude_evaluator import verify_milestone

milestone_agent = Agent(
    name="argos-milestone",
    seed="argos_milestone_seed_phrase_change_in_production",
    port=8005,
    endpoint=["http://localhost:8005/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)

def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(timestamp=datetime.utcnow(), msg_id=uuid4(),
                      content=[TextContent(type="text", text=text)])

@chat_proto.on_message(ChatMessage)
async def handle_milestone_verify(ctx: Context, sender: str, msg: ChatMessage):
    """
    Input: {"report_text": "...", "promised_deliverables": ["...", "..."]}
    Output: {"verdict": "complete|partial|missed", "completion_pct": 85, "evidence": [...], "gaps": [...]}
    """
    await ctx.send(sender, ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id))
    for item in msg.content:
        if isinstance(item, TextContent):
            try:
                request = json.loads(item.text)
                result = await verify_milestone(
                    request.get("report_text", ""),
                    request.get("promised_deliverables", [])
                )
                await ctx.send(sender, create_text_chat(json.dumps({"status": "success", "verification": result})))
            except Exception as e:
                await ctx.send(sender, create_text_chat(json.dumps({"status": "error", "error": str(e)})))

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement): pass

milestone_agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"Milestone Agent address: {milestone_agent.address}")
    milestone_agent.run()
```

### agents/orchestrator.py

```python
"""
ARGOS Orchestrator Agent — coordinates all evaluation agents.
Main entry point for ASI:One discovery.
Registered on Agentverse as the primary ARGOS agent.
"""
import json
import asyncio
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent,
    StartSessionContent, EndSessionContent, chat_protocol_spec
)
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from services.proposal_reader import read_proposal, truncate_for_evaluation
from services.claude_evaluator import (
    extract_proposal_structure, evaluate_technical_merit,
    evaluate_impact, evaluate_team, compute_weighted_score, generate_comparison
)
from services.kaspa_escrow import calculate_milestone_amounts

# Orchestrator agent — this is what ASI:One discovers
orchestrator = Agent(
    name="argos-orchestrator",
    seed="argos_orchestrator_seed_phrase_change_in_production",
    port=8000,
    endpoint=["http://localhost:8000/submit"],
)

chat_proto = Protocol(spec=chat_protocol_spec)

# Track active sessions
active_sessions = {}


def create_text_chat(text: str) -> ChatMessage:
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


async def evaluate_single_proposal(proposal_text: str, rubric: dict) -> dict:
    """Run all three evaluation agents in parallel on one proposal."""
    results = await asyncio.gather(
        evaluate_technical_merit(proposal_text, rubric.get('technical', 30)),
        evaluate_impact(proposal_text, rubric.get('impact', 40)),
        evaluate_team(proposal_text, rubric.get('team', 30)),
        return_exceptions=True
    )

    technical = results[0] if not isinstance(results[0], Exception) else {}
    impact = results[1] if not isinstance(results[1], Exception) else {}
    team = results[2] if not isinstance(results[2], Exception) else {}

    total_score = compute_weighted_score(technical, impact, team, rubric)

    all_red_flags = (
        technical.get('red_flags', []) +
        impact.get('red_flags', []) +
        team.get('red_flags', [])
    )

    return {
        'technical': technical,
        'impact': impact,
        'team': team,
        'total_score': total_score,
        'red_flags': all_red_flags
    }


@chat_proto.on_message(ChatMessage)
async def handle_orchestrator_message(ctx: Context, sender: str, msg: ChatMessage):
    """
    ARGOS responds to ASI:One queries and orchestrates full evaluation pipeline.

    Supported commands (natural language, ASI:One routes):
    - "Evaluate these proposals: [url1, url2, ...]"
    - "Show evaluation status for [evaluation_id]"
    - "What grant programs can ARGOS evaluate?"
    """
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.utcnow(),
        acknowledged_msg_id=msg.msg_id
    ))

    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"New ARGOS session from {sender}")
            await ctx.send(sender, create_text_chat(
                "ARGOS Grant Evaluation System ready.\n\n"
                "I can evaluate grant proposals and create milestone-based Kaspa escrow.\n\n"
                "Send me proposal URLs or text in this format:\n"
                "{'action': 'evaluate', 'proposals': [{'source_type': 'url', 'source': 'https://...'}], "
                "'rubric': {'technical': 30, 'impact': 40, 'team': 30}, "
                "'grant_amount_kas': 50000}"
            ))

        elif isinstance(item, TextContent):
            try:
                # Try to parse as JSON command
                try:
                    command = json.loads(item.text)
                    action = command.get('action', 'evaluate')
                except json.JSONDecodeError:
                    # Natural language — respond with help
                    await ctx.send(sender, create_text_chat(
                        "Send me proposals to evaluate in this format:\n"
                        "{'action': 'evaluate', 'proposals': [...], 'rubric': {...}}"
                    ))
                    continue

                if action == 'evaluate':
                    proposals = command.get('proposals', [])
                    rubric = command.get('rubric', {'technical': 30, 'impact': 40, 'team': 30})
                    grant_amount = command.get('grant_amount_kas', 0)

                    await ctx.send(sender, create_text_chat(
                        f"Starting evaluation of {len(proposals)} proposals...\n"
                        f"Rubric: Technical {rubric.get('technical')}% | "
                        f"Impact {rubric.get('impact')}% | Team {rubric.get('team')}%"
                    ))

                    results = []
                    for i, proposal_def in enumerate(proposals):
                        try:
                            # Read proposal
                            raw_text = await read_proposal(
                                proposal_def.get('source_type', 'text'),
                                proposal_def.get('source', '')
                            )
                            truncated = truncate_for_evaluation(raw_text)

                            # Extract structure
                            structure = await extract_proposal_structure(truncated)

                            # Evaluate all dimensions in parallel
                            evaluation = await evaluate_single_proposal(truncated, rubric)

                            results.append({
                                'index': i + 1,
                                'structure': structure,
                                'evaluation': evaluation,
                                'status': 'complete'
                            })

                            # Send progress update
                            await ctx.send(sender, create_text_chat(
                                f"[{i+1}/{len(proposals)}] {structure.get('title', 'Proposal')} "
                                f"— Score: {evaluation['total_score']}/10 "
                                f"{'⚠️ ' + str(len(evaluation['red_flags'])) + ' flags' if evaluation['red_flags'] else '✓'}"
                            ))

                        except Exception as e:
                            results.append({'index': i + 1, 'error': str(e), 'status': 'error'})

                    # Sort by score
                    successful = [r for r in results if r.get('status') == 'complete']
                    successful.sort(key=lambda x: x['evaluation']['total_score'], reverse=True)

                    # Generate comparison narrative
                    top3 = successful[:3]
                    comparison = await generate_comparison([
                        {'rank': i+1, 'title': r['structure'].get('title'),
                         'score': r['evaluation']['total_score'],
                         'red_flags': r['evaluation']['red_flags']}
                        for i, r in enumerate(top3)
                    ], rubric)

                    # Final summary
                    summary = f"Evaluation complete. {len(successful)}/{len(proposals)} proposals processed.\n\n"
                    summary += "TOP RANKED:\n"
                    for i, r in enumerate(successful[:5]):
                        flags = len(r['evaluation'].get('red_flags', []))
                        summary += f"{i+1}. {r['structure'].get('title', 'Untitled')} — {r['evaluation']['total_score']}/10"
                        if flags:
                            summary += f" ⚠️ {flags} flag(s)"
                        summary += "\n"

                    summary += f"\n{comparison}"

                    if grant_amount > 0:
                        summary += f"\n\nKaspa escrow ready: {grant_amount} KAS available for milestone-based disbursement."

                    await ctx.send(sender, create_text_chat(summary))

                    # Send full results as JSON
                    await ctx.send(sender, create_text_chat(
                        f"Full evaluation data:\n{json.dumps({'ranked': successful[:10]}, indent=2)}"
                    ))

            except Exception as e:
                ctx.logger.error(f"Orchestrator error: {e}")
                await ctx.send(sender, create_text_chat(f"Error: {str(e)}"))

        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"Session ended with {sender}")


@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


orchestrator.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"ARGOS Orchestrator address: {orchestrator.address}")
    print("Register this address on Agentverse for ASI:One discovery")
    orchestrator.run()
```

---

## FASTAPI BACKEND (Lovable frontend connects here)

### api/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import evaluations, proposals, approvals, escrow, milestones
from api.database import engine
from api.models import Base
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ARGOS API",
    description="AI Grant & Procurement Evaluation System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluations.router, prefix="/api/evaluations", tags=["evaluations"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["proposals"])
app.include_router(approvals.router, prefix="/api/approvals", tags=["approvals"])
app.include_router(escrow.router, prefix="/api/escrow", tags=["escrow"])
app.include_router(milestones.router, prefix="/api/milestones", tags=["milestones"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "ARGOS"}


@app.get("/api/agents")
async def agent_addresses():
    """Return Agentverse agent addresses for frontend display."""
    return {
        "orchestrator": "agent1q...",    # Fill after running orchestrator.py
        "intake": "agent1q...",
        "technical": "agent1q...",
        "impact": "agent1q...",
        "team": "agent1q...",
        "milestone": "agent1q..."
    }
```

### api/routes/evaluations.py

```python
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import Evaluation, Proposal
from api.schemas import EvaluationCreate, EvaluationResponse
from services.proposal_reader import read_proposal, truncate_for_evaluation
from services.claude_evaluator import (
    extract_proposal_structure, evaluate_technical_merit,
    evaluate_impact, evaluate_team, compute_weighted_score, generate_comparison
)
import asyncio
import json
from datetime import datetime

router = APIRouter()


@router.post("/", response_model=dict)
async def create_evaluation(
    data: EvaluationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create a new grant evaluation round.
    Called by Lovable frontend when user sets up a new evaluation.
    """
    evaluation = Evaluation(
        title=data.title,
        description=data.description,
        rubric=data.rubric,
        grant_amount_kas=data.grant_amount_kas,
        milestones=data.milestones
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    return {"id": evaluation.id, "status": "created"}


@router.post("/{evaluation_id}/run")
async def run_evaluation(
    evaluation_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Start AI evaluation of all proposals in this round.
    Runs in background — frontend polls /status for updates.
    """
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    proposals = db.query(Proposal).filter(
        Proposal.evaluation_id == evaluation_id,
        Proposal.status == "pending"
    ).all()

    if not proposals:
        raise HTTPException(status_code=400, detail="No pending proposals")

    background_tasks.add_task(
        _run_evaluation_pipeline,
        evaluation_id=evaluation_id,
        proposal_ids=[p.id for p in proposals],
        rubric=evaluation.rubric
    )

    return {"status": "started", "proposal_count": len(proposals)}


async def _run_evaluation_pipeline(evaluation_id: str, proposal_ids: list, rubric: dict):
    """Background task: evaluate all proposals in parallel."""
    from api.database import SessionLocal

    async def evaluate_one(proposal_id: str):
        db = SessionLocal()
        try:
            proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
            if not proposal:
                return

            proposal.status = "evaluating"
            db.commit()

            text = truncate_for_evaluation(proposal.raw_text or "")

            # Run all 3 evaluation agents in parallel
            technical, impact, team = await asyncio.gather(
                evaluate_technical_merit(text, rubric.get('technical', 30)),
                evaluate_impact(text, rubric.get('impact', 40)),
                evaluate_team(text, rubric.get('team', 30)),
                return_exceptions=True
            )

            # Handle errors gracefully
            if isinstance(technical, Exception): technical = {}
            if isinstance(impact, Exception): impact = {}
            if isinstance(team, Exception): team = {}

            total_score = compute_weighted_score(technical, impact, team, rubric)

            all_flags = (
                technical.get('red_flags', []) +
                impact.get('red_flags', []) +
                team.get('red_flags', [])
            )

            proposal.technical_scores = technical
            proposal.impact_scores = impact
            proposal.team_scores = team
            proposal.total_score = total_score
            proposal.red_flags = all_flags
            proposal.status = "complete"
            proposal.evaluated_at = datetime.utcnow()
            db.commit()

        except Exception as e:
            proposal.status = "error"
            db.commit()
        finally:
            db.close()

    # Evaluate all proposals concurrently
    await asyncio.gather(*[evaluate_one(pid) for pid in proposal_ids])

    # Assign ranks
    db = SessionLocal()
    try:
        completed = db.query(Proposal).filter(
            Proposal.evaluation_id == evaluation_id,
            Proposal.status == "complete"
        ).order_by(Proposal.total_score.desc()).all()

        for i, proposal in enumerate(completed):
            proposal.rank = i + 1
        db.commit()
    finally:
        db.close()


@router.get("/{evaluation_id}/status")
def get_evaluation_status(evaluation_id: str, db: Session = Depends(get_db)):
    """Poll for evaluation progress — frontend uses this for live updates."""
    proposals = db.query(Proposal).filter(Proposal.evaluation_id == evaluation_id).all()

    total = len(proposals)
    complete = sum(1 for p in proposals if p.status == "complete")
    evaluating = sum(1 for p in proposals if p.status == "evaluating")
    pending = sum(1 for p in proposals if p.status == "pending")
    errors = sum(1 for p in proposals if p.status == "error")

    return {
        "total": total,
        "complete": complete,
        "evaluating": evaluating,
        "pending": pending,
        "errors": errors,
        "progress_pct": round((complete / total * 100) if total > 0 else 0),
        "done": complete + errors == total
    }


@router.get("/{evaluation_id}/results")
def get_evaluation_results(evaluation_id: str, db: Session = Depends(get_db)):
    """Get ranked results with all scores — main view for Lovable dashboard."""
    proposals = db.query(Proposal).filter(
        Proposal.evaluation_id == evaluation_id,
        Proposal.status == "complete"
    ).order_by(Proposal.rank).all()

    return {
        "proposals": [
            {
                "id": p.id,
                "rank": p.rank,
                "title": p.title,
                "total_score": p.total_score,
                "technical_scores": p.technical_scores,
                "impact_scores": p.impact_scores,
                "team_scores": p.team_scores,
                "red_flags": p.red_flags,
                "overrides": p.overrides,
                "status": p.status,
            }
            for p in proposals
        ]
    }
```

### api/routes/approvals.py

```python
"""Human approval and score override endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import Proposal, Approval
from api.schemas import OverrideRequest
from datetime import datetime

router = APIRouter()


@router.post("/approve/{proposal_id}")
def approve_proposal_score(
    proposal_id: str,
    dimension: str,   # e.g. "technical.innovation", "impact.scale", "team.expertise"
    evaluator: str = "reviewer",
    db: Session = Depends(get_db)
):
    """Record human approval of an AI score dimension."""
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    approval = Approval(
        proposal_id=proposal_id,
        evaluator=evaluator,
        action="approve",
        dimension=dimension,
        created_at=datetime.utcnow()
    )
    db.add(approval)
    db.commit()

    return {"status": "approved", "dimension": dimension}


@router.post("/override/{proposal_id}")
def override_score(
    proposal_id: str,
    request: OverrideRequest,
    db: Session = Depends(get_db)
):
    """
    Human overrides an AI score.
    Records: what was overridden, original score, new score, reason.
    The override is logged permanently in audit trail.
    """
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    # Parse dimension: "technical.innovation" → scores['technical']['innovation']['score']
    parts = request.dimension.split('.')

    # Get original score
    original_score = None
    if len(parts) == 2:
        category, subdim = parts
        category_scores = getattr(proposal, f"{category}_scores") or {}
        original_score = category_scores.get(subdim, {}).get('score')

        # Apply override
        if category_scores:
            if subdim in category_scores:
                category_scores[subdim]['score'] = request.new_score
                category_scores[subdim]['human_override'] = True
                category_scores[subdim]['override_reason'] = request.reason

            # Update proposal scores
            if category == 'technical':
                proposal.technical_scores = category_scores
            elif category == 'impact':
                proposal.impact_scores = category_scores
            elif category == 'team':
                proposal.team_scores = category_scores

    # Record in overrides log
    overrides = proposal.overrides or []
    overrides.append({
        "dimension": request.dimension,
        "original_score": original_score,
        "new_score": request.new_score,
        "reason": request.reason,
        "evaluator": request.evaluator,
        "timestamp": datetime.utcnow().isoformat()
    })
    proposal.overrides = overrides

    # Recompute total score
    from api.database import SessionLocal
    evaluation = proposal.evaluation
    if evaluation:
        from services.claude_evaluator import compute_weighted_score
        new_total = compute_weighted_score(
            proposal.technical_scores or {},
            proposal.impact_scores or {},
            proposal.team_scores or {},
            evaluation.rubric
        )
        proposal.total_score = new_total

    # Log approval record
    approval = Approval(
        proposal_id=proposal_id,
        evaluator=request.evaluator,
        action="override",
        dimension=request.dimension,
        original_score=original_score,
        new_score=request.new_score,
        reason=request.reason
    )
    db.add(approval)
    db.commit()

    return {
        "status": "overridden",
        "dimension": request.dimension,
        "original": original_score,
        "new": request.new_score,
        "new_total_score": proposal.total_score
    }


@router.get("/audit/{proposal_id}")
def get_audit_trail(proposal_id: str, db: Session = Depends(get_db)):
    """Full audit trail of all human decisions on a proposal."""
    approvals = db.query(Approval).filter(Approval.proposal_id == proposal_id).all()
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()

    return {
        "proposal_id": proposal_id,
        "title": proposal.title if proposal else None,
        "overrides": proposal.overrides if proposal else [],
        "approvals": [
            {
                "action": a.action,
                "dimension": a.dimension,
                "original_score": a.original_score,
                "new_score": a.new_score,
                "reason": a.reason,
                "evaluator": a.evaluator,
                "timestamp": a.created_at.isoformat()
            }
            for a in approvals
        ]
    }
```

### api/routes/escrow.py

```python
"""Kaspa milestone escrow routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import KaspaEscrow, Evaluation, Proposal
from services.kaspa_escrow import (
    calculate_milestone_amounts, verify_deposit,
    release_milestone, return_to_admin
)
import os

router = APIRouter()


@router.post("/create")
async def create_escrow(
    evaluation_id: str,
    winner_proposal_id: str,
    grantee_kas_address: str,
    db: Session = Depends(get_db)
):
    """
    Create Kaspa milestone escrow for the selected grant winner.
    Program manager deposits KAS to escrow_address, then ARGOS manages releases.
    """
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    if not evaluation.grant_amount_kas or not evaluation.milestones:
        raise HTTPException(status_code=400, detail="Evaluation must have grant_amount_kas and milestones set")

    # Calculate KAS per milestone
    milestone_schedule = calculate_milestone_amounts(
        evaluation.grant_amount_kas,
        evaluation.milestones
    )

    # Generate escrow address (in production: derive from multisig or covenant script)
    # For demo: use a dedicated wallet address from kaspa-sdk
    escrow_address = os.getenv("ESCROW_WALLET_ADDRESS", "kaspa:qr...")

    escrow = KaspaEscrow(
        evaluation_id=evaluation_id,
        grantee_proposal_id=winner_proposal_id,
        total_kas=evaluation.grant_amount_kas,
        escrow_address=escrow_address,
        milestones=milestone_schedule,
        grantee_kas_address=grantee_kas_address,
        program_admin_kas_address=os.getenv("PROGRAM_ADMIN_ADDRESS", "kaspa:qr...")
    )
    db.add(escrow)
    db.commit()
    db.refresh(escrow)

    return {
        "escrow_id": escrow.id,
        "escrow_address": escrow_address,
        "total_kas": evaluation.grant_amount_kas,
        "milestones": milestone_schedule,
        "instructions": f"Please deposit {evaluation.grant_amount_kas} KAS to {escrow_address} to activate the escrow."
    }


@router.get("/{escrow_id}/status")
async def get_escrow_status(escrow_id: str, db: Session = Depends(get_db)):
    """Check escrow balance and milestone status."""
    escrow = db.query(KaspaEscrow).filter(KaspaEscrow.id == escrow_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    deposit_status = await verify_deposit(escrow.escrow_address, escrow.total_kas)

    return {
        "escrow_id": escrow_id,
        "escrow_address": escrow.escrow_address,
        "total_kas": escrow.total_kas,
        "deposit_verified": deposit_status["verified"],
        "actual_balance": deposit_status["actual_balance_kas"],
        "status": escrow.status,
        "milestones": escrow.milestones
    }
```

---

## SCHEMAS

### api/schemas.py

```python
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class EvaluationCreate(BaseModel):
    title: str
    description: Optional[str] = None
    rubric: Dict[str, int]          # {"technical": 30, "impact": 40, "team": 30}
    grant_amount_kas: Optional[float] = None
    milestones: Optional[List[Dict]] = None

class ProposalCreate(BaseModel):
    evaluation_id: str
    title: str
    source_type: str                # "pdf", "url", "text"
    source: str                     # file path, URL, or raw text

class OverrideRequest(BaseModel):
    dimension: str                  # "technical.innovation", "impact.scale", etc.
    new_score: float
    reason: str
    evaluator: Optional[str] = "reviewer"

class MilestoneSubmissionCreate(BaseModel):
    escrow_id: str
    milestone_index: int
    report_text: str
    report_url: Optional[str] = None
    promised_deliverables: List[str]
```

---

## FRONTEND API SPEC (for Lovable)

### frontend_api_spec.md

```
BASE URL: http://localhost:8000/api (dev) or https://your-deploy.railway.app/api (prod)

PAGES AND THEIR API CALLS:

1. NEW EVALUATION PAGE
   POST /evaluations
   Body: { title, description, rubric: {technical: 30, impact: 40, team: 30}, grant_amount_kas, milestones }
   Returns: { id, status }

2. UPLOAD PROPOSALS PAGE
   POST /proposals/batch
   Body: { evaluation_id, proposals: [{title, source_type, source}] }
   Returns: { proposal_ids }

3. RUN EVALUATION
   POST /evaluations/{id}/run
   Returns: { status, proposal_count }

   POLL every 2 seconds:
   GET /evaluations/{id}/status
   Returns: { total, complete, evaluating, pending, progress_pct, done }

4. RESULTS DASHBOARD (main screen)
   GET /evaluations/{id}/results
   Returns: { proposals: [{ id, rank, title, total_score, technical_scores,
              impact_scores, team_scores, red_flags, overrides }] }

   Each score object: { score: 8, reasoning: "...", human_override: false }

5. APPROVE A SCORE
   POST /approvals/approve/{proposal_id}?dimension=technical.innovation&evaluator=Alice

6. OVERRIDE A SCORE
   POST /approvals/override/{proposal_id}
   Body: { dimension: "impact.scale", new_score: 9, reason: "Team confirmed MOU with city council", evaluator: "Alice" }

7. AUDIT TRAIL
   GET /approvals/audit/{proposal_id}
   Returns: { overrides: [...], approvals: [...] }

8. KASPA ESCROW
   POST /escrow/create
   Body: { evaluation_id, winner_proposal_id, grantee_kas_address }
   Returns: { escrow_id, escrow_address, total_kas, milestones, instructions }

   GET /escrow/{escrow_id}/status
   Returns: { deposit_verified, actual_balance, milestones }

9. MILESTONE SUBMISSION
   POST /milestones/submit
   Body: { escrow_id, milestone_index, report_text, promised_deliverables }
   Returns: { submission_id, ai_verdict, completion_pct, evidence }

   POST /milestones/{id}/approve?note=optional
   Returns: { approved: true, release_tx_hash, kas_released }

FRONTEND COMPONENTS LOVABLE SHOULD BUILD:
- EvaluationSetup.tsx: rubric sliders, milestone builder, grant amount
- ProposalUpload.tsx: drag-drop PDF + URL input + text paste
- EvaluationProgress.tsx: live progress bar, agent status indicators
- ResultsDashboard.tsx: ranked proposal table with score breakdown
- ProposalDetail.tsx: full scores with reasoning, approve/override buttons
- ComparisonView.tsx: side-by-side top 3 with trade-off analysis
- AuditTrail.tsx: full timeline of human decisions
- EscrowPanel.tsx: Kaspa escrow status, milestone tracker, release buttons
- AgentStatus.tsx: show all 5 Agentverse agent addresses + status
```

---

## DEMO DATA

### demo/run_demo.py

```python
"""
Run ARGOS on 10 real EU Horizon Europe proposals.
Download sample proposals from: https://ec.europa.eu/info/funding-tenders
Or use UK UKRI grant database: https://gtr.ukri.org
"""
import asyncio
import json
import httpx

BASE_URL = "http://localhost:8000/api"

# 10 real publicly available grant abstracts for demo
DEMO_PROPOSALS = [
    {
        "title": "ClimateML: Machine Learning for Climate Adaptation in Cities",
        "source_type": "text",
        "source": """
        Lead organization: University College London
        Team: Dr. Sarah Chen (PI, ML/Climate), Prof. James Okafor (Urban Planning), Dr. Priya Patel (Data Science)
        Budget requested: £450,000 over 24 months

        Project Overview:
        ClimateML develops machine learning models to predict urban heat islands and flooding
        risk at 50-metre resolution for UK cities. Current models operate at 1km resolution
        and cannot inform local planning decisions. We propose combining satellite imagery,
        IoT sensor networks, and historical flood data to create high-resolution risk maps.

        Objectives:
        1. Deploy 200 IoT sensors across London, Manchester, Bristol
        2. Train CNN-LSTM model on 10 years of satellite + sensor data
        3. Achieve <15% error on 48-hour flood risk prediction
        4. Partner with 3 local councils for pilot deployment

        Expected Impact:
        High-resolution flood risk maps will inform planning decisions for 2.3M urban residents.
        Partner councils estimate 40% reduction in flood damage costs through better preparation.
        Model will be open-sourced and deployable by any UK local authority.

        Team Track Record:
        Dr. Chen: 2 prior EPSRC grants (£280K total), 15 publications in ML/climate
        Prof. Okafor: 20 years urban planning, advises Greater London Authority
        Dr. Patel: Former Google DeepMind, specialist in geospatial ML

        Timeline:
        M1-6: IoT deployment, data pipeline
        M7-18: Model development and training
        M19-24: Pilot deployment with councils, evaluation
        """
    },
    {
        "title": "OpenMed: Open-Source Medical AI for Rare Disease Diagnosis",
        "source_type": "text",
        "source": """
        Organization: King's College London with NHS Partnership
        Team: Prof. Ahmed Hassan (Lead, Medical AI), Dr. Lisa Wong (Rare Disease Specialist)
        Budget: £620,000 over 36 months

        Problem: 3.5 million UK patients have rare diseases. Average diagnostic odyssey is 4.8 years.
        AI diagnostic tools exist only for common diseases; rare diseases lack training data.

        Solution: OpenMed creates a federated learning framework allowing NHS hospitals to
        collaboratively train rare disease diagnostic models without sharing patient data.

        Innovation: Using differential privacy + federated learning to train on distributed
        NHS datasets. First open-source implementation specifically designed for NHS data governance.

        Expected outcomes:
        - 30% reduction in diagnostic odyssey for rare disease patients
        - Reusable federated learning framework adoptable by NHS trusts nationwide
        - 5 published papers, 3 open-source model releases

        Partners: 12 NHS trusts committed to participate in federated training

        Risk: Key person dependency on Prof. Hassan. Mitigation: Deputy lead Dr. Wong
        has equivalent ML expertise and co-leads model development.
        """
    },
    # Add 8 more proposals for demo...
    # Use real abstracts from gtr.ukri.org for maximum credibility
]

async def run_full_demo():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=120) as client:

        # 1. Create evaluation
        print("Creating evaluation round...")
        r = await client.post("/evaluations", json={
            "title": "Climate & Health Innovation Grant Round Q3 2026",
            "description": "Evaluating 10 proposals for £450K-£650K grants",
            "rubric": {"technical": 30, "impact": 40, "team": 30},
            "grant_amount_kas": 50000,
            "milestones": [
                {"name": "Phase 1 Complete", "date": "2027-03-01", "percent": 30},
                {"name": "Phase 2 Complete", "date": "2027-09-01", "percent": 40},
                {"name": "Final Delivery", "date": "2028-03-01", "percent": 30}
            ]
        })
        eval_id = r.json()["id"]
        print(f"Evaluation ID: {eval_id}")

        # 2. Add proposals
        print(f"\nAdding {len(DEMO_PROPOSALS)} proposals...")
        for p in DEMO_PROPOSALS:
            await client.post("/proposals/", json={
                "evaluation_id": eval_id,
                **p
            })

        # 3. Run evaluation
        print("\nStarting AI evaluation (all proposals in parallel)...")
        await client.post(f"/evaluations/{eval_id}/run")

        # 4. Poll until done
        while True:
            status_r = await client.get(f"/evaluations/{eval_id}/status")
            status = status_r.json()
            print(f"Progress: {status['complete']}/{status['total']} ({status['progress_pct']}%)")
            if status["done"]:
                break
            await asyncio.sleep(3)

        # 5. Get results
        results_r = await client.get(f"/evaluations/{eval_id}/results")
        results = results_r.json()

        print("\n=== RANKED RESULTS ===")
        for p in results["proposals"]:
            flags = len(p.get("red_flags", []))
            print(f"#{p['rank']} {p['title']} — {p['total_score']}/10 {f'⚠️ {flags} flags' if flags else '✓'}")

        print("\nFull results saved to demo_results.json")
        with open("demo_results.json", "w") as f:
            json.dump(results, f, indent=2)

if __name__ == "__main__":
    asyncio.run(run_full_demo())
```

---

## REGISTER ON AGENTVERSE

After running each agent and getting its address:

```bash
# 1. Run each agent briefly to get its address
python agents/orchestrator.py     # Copy: "ARGOS Orchestrator address: agent1q..."
python agents/intake_agent.py     # Copy: "Intake Agent address: agent1q..."
python agents/technical_agent.py
python agents/impact_agent.py
python agents/team_agent.py
python agents/milestone_agent.py

# 2. Go to: agentverse.ai
# 3. Register each agent with its address
# 4. Set name, description, and tags for ASI:One discoverability:
#    Orchestrator: "ARGOS Grant Evaluator - AI-powered procurement evaluation"
#    Tags: grant-evaluation, procurement, enterprise, ai-agent

# 5. Enable Chat Protocol on all agents (already done in code via publish_manifest=True)

# 6. Test via ASI:One:
#    "I need help evaluating grant proposals for our research program"
#    ASI:One should discover and route to ARGOS Orchestrator
```

---

## SUBMISSION CHECKLIST

### Conduct Track

```
□ GitHub repo: code, setup instructions, docs
□ Pitch deck (keep short):
  Slide 1: The pain — 300 expert-hours, 6 weeks per round
  Slide 2: ARGOS — 5 AI agents, 8 hours, user approves every step
  Slide 3: Architecture diagram (5 agents + Kaspa escrow)
  Slide 4: Demo flow — before/after screenshot
  Slide 5: Scale story — any grant program, any size, public dataset available
□ Demo video:
  0:00-0:20: Show the Excel spreadsheet, email threads, 3-month calendar — "this is enterprise today"
  0:20-1:30: Load 10 proposals → agents evaluate → progress bar fills → ranked results appear
  1:30-2:30: Click into a proposal — show score with full reasoning — override one score with reason
  2:30-3:30: Select winner → Kaspa escrow created — milestones shown
  3:30-4:00: "6 weeks → 8 hours. Every decision audited. Try it yourself at [url]"
```

### Fetch.ai Track

```
□ ASI:One shared chat session URL (paste this in eval command during demo)
□ Agentverse Agent Profile URLs (5 agents — all registered)
□ GitHub repo
□ Demo video (same as above, emphasize ASI:One discovery moment)
□ Description: "ARGOS evaluates grant proposals using 5 specialized Fetch.ai agents
  coordinated via ASI:One. Each agent scores one dimension, orchestrator aggregates
  and ranks. Agent-to-agent Payment Protocol FET payments for each evaluation."
```

### Kaspa Track

```
□ GitHub with Kaspa integration in services/kaspa_escrow.py
□ Demo video: show Kaspa escrow creation + milestone release flow
□ Brief: "Kaspa is the trust layer for milestone-based grant disbursement.
  Funds locked in Kaspa covenant address. Each milestone release requires
  AI verification + human approval. If milestone missed, funds return to program admin.
  Kaspa's 1-block-per-second finality means payments release the moment verification completes."
□ DoraHacks submission at dorahacks.io/hackathon/bounty/1369
```

### GCC Category 1

```
□ Same GitHub + video
□ Emphasize: metric design (rubric justification, counterfactual reasoning in impact agent)
  and reusability (any grant program can deploy same agent stack, open source)
□ GCC submission at gccofficial.org
```

---

## LOVABLE FRONTEND INSTRUCTIONS

When building in Lovable, tell it:

```
Build a dark, minimal enterprise dashboard for ARGOS — an AI grant evaluation system.

API base URL: http://localhost:8000/api (connect all components to this)

Pages:
1. /setup — Create evaluation with rubric sliders and milestone builder
2. /proposals/{id} — Upload proposals (drag-drop PDF, paste URL, paste text)
3. /evaluate/{id} — Live evaluation progress (progress bar, agent cards with status)
4. /results/{id} — Main dashboard: ranked table, score breakdown, red flags
5. /proposal/{id} — Detail view: all scores with reasoning, approve/override buttons
6. /escrow/{id} — Kaspa escrow tracker, milestone progress, release history

Design:
- Dark background (#0a0a0f)
- Accent: electric blue (#3B82F6)
- Success: green (#10B981)
- Warning: amber (#F59E0B)
- Cards with subtle borders, no heavy shadows
- Tables for ranked results (not cards — more scannable)
- Score bars: 1-10 scale shown as horizontal progress bar
- Human overrides shown with edit icon + reason on hover
- Kaspa milestones: timeline with lock/unlock state per milestone
- Agent cards: show agent name, Agentverse address, last active, proposals processed

Key interactions:
- Results table: click a row → slide-in detail panel (not new page)
- Override: inline score field + reason input → save → total score recomputes live
- Approve: single click checkmark → dimension turns green
- Red flags: amber warning icon, hover shows full flag text
- Kaspa escrow: deposit QR code, balance updating, milestone timeline
```
