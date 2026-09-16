# Relay

Relay is a small-business customer assistant and sales demo. A business owner keeps approved facts in a simple workspace; a prospect tries the experience in a separate phone-shaped demo. Booking, order and viewing enquiries are saved to Google Sheets for follow-up.

## What v1 does

- Manages business identity, address, opening hours, services/products, prices and approved FAQ answers.
- Gives prospects a public, English-language messaging demo.
- Saves customer requests without inventing availability, payment or confirmation.
- Uses Google Sheets as a straightforward per-business data store.
- Includes a public product landing page, customer demo and business workspace.

It intentionally does not provide real WhatsApp delivery, payment, a calendar, multi-user permissions or AI-generated answers yet. See [docs/SLC-PRODUCT-BRIEF.md](docs/SLC-PRODUCT-BRIEF.md).

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Google credentials, the app uses clearly labelled, reset-on-restart demo memory. Never use that mode for customer data.

## Google Sheets setup

1. Create one empty Google Sheet for the business.
2. Create a least-privilege Google Cloud service account with Sheets API access.
3. Share only that sheet with the service-account email as Editor.
4. Set `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in the deployment environment.
5. On first use Relay creates `Business`, `Hours`, `Offerings`, `FAQs` and `Leads` tabs.

Use a separate sheet and deployment configuration per client during the pilot. Do not put credentials in the sheet or browser.

## Security

- `.env*`, private keys, service-account files and deployment metadata are ignored.
- Secrets are read only in server-side modules.
- Public demo data is exposed through a separate read-only endpoint that never returns customer leads.
- The public demo validates input, caps message size and rate-limits requests.
- Legacy unauthenticated mutation and webhook routes have been removed.
- The workspace is intentionally open for the current sales demo. Do not connect real customer data on a public deployment until managed authentication is added.

Before every release run `npm run lint` and `npm run build`.

Add managed authentication and per-business authorization before using the workspace with real customer data.
