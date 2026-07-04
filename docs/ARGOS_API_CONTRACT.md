# ARGOS API Contract

Base URL: `http://localhost:8000/api` (dev) | `https://<deployed>/api` (prod)

All protected endpoints require header: `Authorization: Bearer <JWT>` from `/api/auth/login` or `/api/auth/register`.

## Auth

| Method | Path              | Body            | Response                    |
| ------ | ----------------- | --------------- | --------------------------- |
| POST   | `/auth/register`  | email, password, organization_name | `{ access_token, user }` |
| POST   | `/auth/login`     | email, password | `{ access_token, user }`    |
| POST   | `/auth/verify-email` | code         | `{ email_verified: true }`  |
| GET    | `/auth/me`        | —               | Current user + org          |

## Health

| Method | Path            | Description                |
| ------ | --------------- | -------------------------- |
| GET    | `/health`       | Service status             |
| GET    | `/health/db`    | Database connectivity      |
| GET    | `/health/kaspa` | Kaspa API reachability     |
| GET    | `/agents`       | Agentverse agent addresses |

## Evaluations

| Method | Path                        | Body               | Response                                                               |
| ------ | --------------------------- | ------------------ | ---------------------------------------------------------------------- |
| POST   | `/evaluations`              | `EvaluationCreate` | `{ id, status }`                                                       |
| GET    | `/evaluations`              | —                  | `{ evaluations: [...] }`                                               |
| GET    | `/evaluations/{id}`         | —                  | `EvaluationResponse`                                                   |
| POST   | `/evaluations/{id}/run`     | —                  | `{ status, proposal_count }`                                           |
| GET    | `/evaluations/{id}/status`  | —                  | `{ total, complete, evaluating, pending, errors, progress_pct, done }` |
| GET    | `/evaluations/{id}/results` | —                  | `{ proposals: [...] }`                                                 |

### EvaluationCreate

```json
{
  "title": "Q3 2026 Climate Grant Round",
  "description": "Optional",
  "rubric": { "technical": 30, "impact": 40, "team": 30 },
  "grant_amount_kas": 50000,
  "milestones": [{ "name": "Phase 1", "date": "2027-03-01", "percent": 30 }]
}
```

## Proposals

| Method | Path                            | Body                                  | Response                  |
| ------ | ------------------------------- | ------------------------------------- | ------------------------- |
| POST   | `/proposals`                    | `ProposalCreate`                      | `{ id, status }`          |
| POST   | `/proposals/batch`              | `{ evaluation_id, proposals: [...] }` | `{ proposal_ids: [...] }` |
| GET    | `/proposals/{id}`               | —                                     | `ProposalResponse`        |
| GET    | `/proposals?evaluation_id={id}` | —                                     | `{ proposals: [...] }`    |

### ProposalCreate

```json
{
  "evaluation_id": "uuid",
  "title": "ClimateML",
  "source_type": "text|url|pdf",
  "source": "raw text or URL"
}
```

PDF upload: `POST /proposals/upload` multipart with `file`, `evaluation_id`, `title`.

## Approvals

| Method | Path                                                                              | Body              | Response                                                |
| ------ | --------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------- |
| POST   | `/approvals/approve/{proposal_id}?dimension=technical.innovation&evaluator=Alice` | —                 | `{ status, dimension }`                                 |
| POST   | `/approvals/override/{proposal_id}`                                               | `OverrideRequest` | `{ status, dimension, original, new, new_total_score }` |
| GET    | `/approvals/audit/{proposal_id}`                                                  | —                 | `{ overrides, approvals }`                              |

### OverrideRequest

```json
{
  "dimension": "impact.scale",
  "new_score": 9,
  "reason": "Team confirmed MOU with city council",
  "evaluator": "Alice"
}
```

## Escrow

| Method | Path                         | Body                                                         | Response                                                             |
| ------ | ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| POST   | `/escrow/create`             | `{ evaluation_id, winner_proposal_id, grantee_kas_address }` | `{ escrow_id, escrow_address, total_kas, milestones, instructions }` |
| GET    | `/escrow/{escrow_id}/status` | —                                                            | `{ deposit_verified, actual_balance, milestones, status }`           |
| GET    | `/escrow?evaluation_id={id}` | —                                                            | `{ escrows: [...] }`                                                 |

## Milestones

| Method | Path                                     | Body                        | Response                                                  |
| ------ | ---------------------------------------- | --------------------------- | --------------------------------------------------------- |
| POST   | `/milestones/submit`                     | `MilestoneSubmissionCreate` | `{ submission_id, ai_verdict, completion_pct, evidence }` |
| POST   | `/milestones/{id}/approve?note=optional` | —                           | `{ approved, release_tx_hash, kas_released, explorer_tx_url }` |

## Payments (Fetch.ai)

| Method | Path               | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/payments/stats`  | FET totals by agent      |
| GET    | `/payments/ledger` | Recent agent payment log |

## Dashboard

| Method | Path                 | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/dashboard/stats`   | KPIs, GCC public capital, FET stats  |
| GET    | `/dashboard/activity`| Recent approvals, releases, flags    |

## Score Object Shape

```json
{
  "innovation": { "score": 8, "reasoning": "...", "human_override": false },
  "feasibility": { "score": 7, "reasoning": "..." },
  "methodology": { "score": 8, "reasoning": "..." },
  "red_flags": ["Missing budget breakdown"]
}
```

## TypeScript Types

See `src/lib/api.ts` for frontend-aligned types.
