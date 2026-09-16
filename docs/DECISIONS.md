# Architecture decisions

## 2026-09-15 — Google Sheets for paid pilots

**Context:** Owners already understand spreadsheets and each pilot has modest traffic.
**Decision:** Use one Sheet per business behind a server-only repository.
**Alternative:** PostgreSQL with a multi-tenant schema.
**Tradeoff:** Faster onboarding and lower operational burden, but weak concurrency and auditability. Revisit when measured usage or access-control requirements outgrow Sheets.

## 2026-09-15 — Requests are unconfirmed

**Context:** The app has no authoritative staff calendar, stock reservation or payment provider.
**Decision:** Capture intent and contact details, then require owner confirmation.
**Alternative:** Simulate autonomous completion.
**Tradeoff:** Less “magic,” much higher customer trust and no false promises.
