---
product: "Relay"
status: "building"
mode: "slc-audit"
updated: "2026-09-15"
---

# SLC Product Brief — Relay

## Executive decision

**Verdict:** Reduce scope and build a complete paid-pilot product.

**Core contract:** For an independent business owner, when customers repeatedly ask the same questions or request a booking/order in chat, Relay gives customers approved information and records a structured request so the owner can follow up without losing it.

**v1 does not promise:** confirmed appointments, payments, inventory reservation, real WhatsApp delivery, staff calendars, multi-branch support or free-form AI advice.

## Evidence, assumptions and decisions

### Facts

- The previous repository mixed owner operations and a customer chat simulator on one screen.
- State lived in a server-process singleton and disappeared on restart.
- Mutation and webhook endpoints had no authentication or signature verification.
- The repository contains working restaurant automation assets and spreadsheet templates, but not evidence that three sectors need one shared operational product today.

### Assumptions to validate

- Nearby independent businesses will pay for fewer missed enquiries.
- A familiar chat demo shortens the sales conversation.
- Google Sheets is acceptable to owners during the first paid pilots.

### Decisions

- One workflow across sectors: approved answer → captured request → owner follow-up.
- The sales landing page, customer demo and business workspace have separate routes and jobs.
- Google Sheets is the pilot system of record behind a repository boundary.
- The assistant is deterministic in v1; it cannot invent business facts.

## SLC assessment

| Dimension | Before | Now | Reason |
|---|---:|---:|---|
| Simple | 2/5 | 4/5 | Removed three partial operational systems and kept one cross-sector job. |
| Lovable | 2/5 | 4/5 | A focused, phone-like demo produces a real follow-up request. |
| Complete | 1/5 | 4/5 | Business setup, customer answer and persisted lead form one end-to-end path. |

**Evolvability risk:** Medium. The provider boundary is clean, but Sheets has weak concurrency and Basic Auth is single-owner only.

## Happy path

1. Seller creates a Sheet and deployment for a pilot customer.
2. Owner enters business facts, hours, offerings and answers.
3. Owner opens the separate customer demo.
4. Prospect asks a question and receives only approved information.
5. Prospect requests a booking, order or viewing.
6. Relay records the request as unconfirmed in `Leads`.
7. Owner sees the new request and follows up.

## Trust and failure rules

| Failure | Safe behaviour |
|---|---|
| Availability is unknown | Save a request; never confirm a time. |
| A fact is missing | Say the team will follow up; never invent it. |
| Sheets is unavailable | Return a clear error; do not claim the request was saved. |
| Admin credentials are missing in production | Deny workspace access. |
| Demo is abused | Limit input length and request rate. |

## Architecture for today

One Next.js modular monolith with server-only repository, deterministic response engine, sales landing page, customer demo, business workspace and Google Sheets adapter. Google credentials never cross the server boundary. The workspace remains demo-only until authentication is added.

Expensive-to-reverse decisions: each record has a stable ID; each deployment owns one business dataset; requests remain explicitly unconfirmed; secrets are environment-only.

## Validation plan

| Assumption | Cheapest test | Continue signal |
|---|---|---|
| Owners value captured enquiries | Run with 3 businesses for 2 weeks | 2+ owners follow up from the sheet weekly. |
| Demo helps sales | Use it in 10 sales visits | 3 ask for a configured pilot. |
| Sheets is usable | Observe owners managing data | 2+ update data unaided after setup. |

## Parking lot and triggers

- Real WhatsApp: add only after a paid pilot asks to connect its verified number.
- Managed authentication: add before any public deployment stores real customer data.
- Calendar availability: add after appointment businesses repeatedly lose time to manual confirmation.
- Database: move from Sheets when concurrent writes, query latency or audit requirements become measured constraints.
- AI/NLP: add only with an evaluation set and a human-safe uncertainty policy.
