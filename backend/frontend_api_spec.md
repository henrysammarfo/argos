BASE URL: http://localhost:8000/api (dev) or https://your-deploy.railway.app/api (prod)

See docs/ARGOS_API_CONTRACT.md for full specification.

PAGES AND THEIR API CALLS:

1. NEW EVALUATION PAGE (/app/setup)
   POST /evaluations
   Body: { title, description, rubric, grant_amount_kas, milestones }

2. UPLOAD PROPOSALS
   POST /proposals/batch
   Body: { evaluation_id, proposals: [{title, source_type, source}] }

3. RUN EVALUATION
   POST /evaluations/{id}/run
   POLL: GET /evaluations/{id}/status

4. RESULTS DASHBOARD
   GET /evaluations/{id}/results

5. APPROVE / OVERRIDE
   POST /approvals/approve/{proposal_id}?dimension=...
   POST /approvals/override/{proposal_id}

6. KASPA ESCROW
   POST /escrow/create
   GET /escrow/{escrow_id}/status

7. MILESTONE SUBMISSION
   POST /milestones/submit
   POST /milestones/{id}/approve

All mutations require header: X-Admin-Key: <ADMIN_API_KEY>
