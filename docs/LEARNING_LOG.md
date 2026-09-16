# Learning log

## Concept: Server-only provider adapters

**Where used:** `src/core/repository.ts` and `src/core/sheets-repository.ts`.
**What it does:** The app asks one repository interface for data; Google-specific authentication stays inside its adapter.
**Why here:** Browser code never receives private keys, and Sheets can later be replaced without rewriting the UI.
**Remember:** Future-proof the boundary, not every hypothetical provider.

## Concept: Trustworthy automation

**Where used:** `src/core/assistant.ts`.
**What it does:** The assistant answers from approved records and stores an unconfirmed request.
**Why here:** Confirmation requires authoritative availability, stock or payment data that v1 does not have.
**Remember:** When the system cannot prove an outcome, record intent and ask a human to confirm it.
