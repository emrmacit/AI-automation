# Product and technical audit

## Critical findings addressed

- Volatile in-memory state was presented as an operational system. Google Sheets persistence is now supported and fallback mode is explicitly labelled demo-only.
- Anyone could trigger unsafe appointment, stock, order or handoff mutations. Those legacy routes and claims were removed.
- The webhook accepted unverified payloads and could trigger actions. It was removed until a provider with signature verification is selected.
- The product claimed payments, reminders and confirmed availability without integrations that could prove them. Those claims and actions were removed.

## Gaps before broad commercial launch

1. Add managed authentication and per-business authorization. The current open workspace is for synthetic sales-demo data only.
2. Connect a verified WhatsApp Business provider with webhook signatures, idempotency and delivery status.
3. Add privacy notice, retention rules, data deletion/export and processor agreements for contact data.
4. Add durable distributed rate limiting before public promotion.
5. Add monitoring, backups/restore testing and an operator support view.
6. Decide pricing, onboarding ownership, support boundaries and a pilot contract.

## Commercial recommendation

Sell a narrow paid pilot, not a universal “AI automation platform”: setup + approved answers + captured enquiries for one channel and one business. Choose one initial niche—appointment businesses are the strongest fit—then promote the next feature only after observed usage identifies the bottleneck.
