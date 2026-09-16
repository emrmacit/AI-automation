import type { BusinessState, DemoReply, Lead } from './types';
import type { BusinessRepository } from './repository';

const has = (text: string, words: string[]) => words.some((word) => text.includes(word));
const money = (value: number, currency: string) => new Intl.NumberFormat('en', { style: 'currency', currency }).format(value);

export async function answerDemoMessage(repository: BusinessRepository, state: BusinessState, rawMessage: string, customerName: string, contact: string): Promise<DemoReply> {
  const message = rawMessage.toLowerCase();
  const { profile, offerings, hours, faqs } = state;
  let reply = profile.welcomeMessage;
  let leadCreated = false;
  if (has(message, ['price', 'cost', 'service', 'menu', 'product', 'offer'])) {
    const available = offerings.filter((item) => item.isAvailable).slice(0, 8);
    reply = available.length ? `Here is what ${profile.name} currently offers:\n\n${available.map((item) => `• ${item.name} — ${money(item.price, profile.currency)}${item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}`).join('\n')}\n\nTell me what you are interested in and I’ll pass your request to the team.` : 'The business is still preparing its current list. I can take your contact details so the team can help directly.';
  } else if (has(message, ['open', 'hour', 'close', 'when'])) {
    reply = hours.map((item) => `${item.day}: ${item.isOpen ? `${item.opensAt}–${item.closesAt}` : 'Closed'}`).join('\n');
  } else if (has(message, ['where', 'address', 'location', 'find you'])) {
    reply = `${profile.name} is at ${profile.address}. You can reach the business on ${profile.phone}.`;
  } else {
    const faq = faqs.find((item) => item.question.toLowerCase().split(/\W+/).filter((word) => word.length > 4).some((word) => message.includes(word)));
    if (faq) reply = faq.answer;
  }
  if (has(message, ['book', 'appointment', 'reserve', 'order', 'buy', 'viewing', 'interested'])) {
    const lead: Lead = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), customerName: customerName || 'Demo visitor',
      contact: contact || 'Not provided', intent: profile.category === 'Real estate' ? 'Viewing request' : profile.category === 'Restaurant' || profile.category === 'Retail' ? 'Order enquiry' : 'Appointment request',
      summary: rawMessage.slice(0, 300), status: 'new', source: 'demo',
    };
    await repository.addLead(lead);
    leadCreated = true;
    reply = `Thanks${customerName ? `, ${customerName}` : ''}. I’ve saved your request for ${profile.name}. The team will confirm availability and final details with you${contact ? ` at ${contact}` : ''}.`;
  }
  return { reply, leadCreated };
}
