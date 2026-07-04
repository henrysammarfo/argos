"""Run ARGOS full pipeline demo against local API."""

import asyncio
import json
import os

import httpx

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api")
ADMIN_KEY = os.getenv("ADMIN_API_KEY", "")

DEMO_PROPOSALS = [
    {
        "title": "ClimateML: Machine Learning for Climate Adaptation in Cities",
        "source_type": "text",
        "source": """
        Lead organization: University College London
        Team: Dr. Sarah Chen (PI, ML/Climate), Prof. James Okafor (Urban Planning)
        Budget requested: £450,000 over 24 months

        ClimateML develops machine learning models to predict urban heat islands and flooding
        risk at 50-metre resolution for UK cities. We propose combining satellite imagery,
        IoT sensor networks, and historical flood data to create high-resolution risk maps.

        Expected Impact: High-resolution flood risk maps will inform planning for 2.3M residents.
        Dr. Chen: 2 prior EPSRC grants (£280K total), 15 publications in ML/climate.
        """,
    },
    {
        "title": "OpenMed: Open-Source Medical AI for Rare Disease Diagnosis",
        "source_type": "text",
        "source": """
        Organization: King's College London with NHS Partnership
        Team: Prof. Ahmed Hassan (Lead, Medical AI), Dr. Lisa Wong (Rare Disease Specialist)
        Budget: £620,000 over 36 months

        OpenMed creates a federated learning framework allowing NHS hospitals to
        collaboratively train rare disease diagnostic models without sharing patient data.
        Expected: 30% reduction in diagnostic odyssey for rare disease patients.
        Partners: 12 NHS trusts committed to participate.
        """,
    },
    {
        "title": "GridFlex: Decentralized Energy Trading for Rural Communities",
        "source_type": "text",
        "source": """
        Organization: Edinburgh Renewable Energy Cooperative
        Team: Dr. Elena Vasquez (Energy Systems), James Okonkwo (Blockchain)
        Budget: £380,000 over 18 months

        GridFlex enables peer-to-peer renewable energy trading in rural Scotland using
        smart contracts. Pilot with 500 households across 3 communities.
        Expected: 25% reduction in energy costs for participants.
        """,
    },
]


async def run_full_demo():
    headers = {"X-Admin-Key": ADMIN_KEY} if ADMIN_KEY else {}

    async with httpx.AsyncClient(
        base_url=BASE_URL, timeout=120, headers=headers, follow_redirects=True
    ) as client:
        print("Creating evaluation round...")
        r = await client.post(
            "/evaluations",
            json={
                "title": "Climate & Health Innovation Grant Round Q3 2026",
                "description": "Evaluating 3 proposals for £450K-£650K grants",
                "rubric": {"technical": 30, "impact": 40, "team": 30},
                "grant_amount_kas": 50000,
                "milestones": [
                    {"name": "Phase 1 Complete", "date": "2027-03-01", "percent": 30},
                    {"name": "Phase 2 Complete", "date": "2027-09-01", "percent": 40},
                    {"name": "Final Delivery", "date": "2028-03-01", "percent": 30},
                ],
            },
        )
        r.raise_for_status()
        eval_id = r.json()["id"]
        print(f"Evaluation ID: {eval_id}")

        print(f"\nAdding {len(DEMO_PROPOSALS)} proposals...")
        batch_r = await client.post(
            "/proposals/batch",
            json={
                "evaluation_id": eval_id,
                "proposals": [
                    {**p, "evaluation_id": eval_id} for p in DEMO_PROPOSALS
                ],
            },
        )
        batch_r.raise_for_status()
        print(f"Proposal IDs: {batch_r.json()['proposal_ids']}")

        print("\nStarting AI evaluation...")
        await client.post(f"/evaluations/{eval_id}/run")

        while True:
            status_r = await client.get(f"/evaluations/{eval_id}/status")
            status = status_r.json()
            print(
                f"Progress: {status['complete']}/{status['total']} ({status['progress_pct']}%)"
            )
            if status["done"]:
                break
            await asyncio.sleep(2)

        results_r = await client.get(f"/evaluations/{eval_id}/results")
        results = results_r.json()

        print("\n=== RANKED RESULTS ===")
        for p in results["proposals"]:
            flags = len(p.get("red_flags", []))
            print(
                f"#{p['rank']} {p['title']} — {p['total_score']}/10"
                + (f" ({flags} flags)" if flags else "")
            )

        out_path = os.path.join(os.path.dirname(__file__), "demo_results.json")
        with open(out_path, "w") as f:
            json.dump(results, f, indent=2)
        print(f"\nFull results saved to {out_path}")


if __name__ == "__main__":
    asyncio.run(run_full_demo())
