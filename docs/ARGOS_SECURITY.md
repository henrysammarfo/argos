# ARGOS Security

## Threat Model

| Threat                      | Mitigation                                               |
| --------------------------- | -------------------------------------------------------- |
| Unauthorized score override | JWT Bearer auth; org-scoped data access                  |
| SQL injection               | SQLAlchemy ORM only; no raw SQL                          |
| XSS via proposal text       | Pydantic validation; frontend escapes by default (React) |
| File upload abuse           | 10 MB cap, MIME validation on PDF uploads                |
| Rate abuse                  | slowapi rate limits on auth, `/run`, `/submit`           |
| Secret leakage              | `.env` gitignored; seed phrases never in code/logs       |
| CORS abuse                  | Explicit origin allowlist                                |
| Audit tampering             | Approvals append-only; overrides logged with timestamp   |
| Cross-tenant data leak    | All queries filtered by `organization_id`                |

## Implemented Controls

- **JWT session auth** — bcrypt passwords; Bearer token on all protected routes
- **Multi-tenant isolation** — evaluations, proposals, escrows scoped per organization
- **Input validation** — Pydantic v2 strict schemas on all endpoints
- **Structured logging** — JSON logs with request IDs; no secrets in logs
- **Error handling** — No stack traces in production responses
- **Dependency scanning** — `pip audit` + `bun audit` in CI

## Known Limitations (hackathon scope)

- No formal penetration test or third-party audit
- Email verification optional (SMTP not required in dev)
- Kaspa seed phrase stored in env (production would use HSM/vault)
- TN12 covenant scripts not audited for mainnet
- OpenAI API responses not cryptographically verified

## Recommendations for Production

1. OAuth2/OIDC for reviewer authentication
2. HashiCorp Vault or AWS Secrets Manager for keys
3. WAF + DDoS protection on public endpoints
4. Immutable audit log (append-only table or blockchain anchor)
5. SOC 2 compliance review before enterprise deployment

## Honest Statement

ARGOS is a hackathon MVP with real AI, real Kaspa testnet integration, and production-oriented patterns (PostgreSQL, Alembic, rate limits). It is not certified for government procurement without further security review.
