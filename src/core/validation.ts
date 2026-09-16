import { BUSINESS_CATEGORIES, type SaveBusinessInput } from './types';

const text = (value: unknown, max: number) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
export function validateBusinessInput(value: unknown): value is SaveBusinessInput {
  if (!value || typeof value !== 'object') return false;
  const input = value as Partial<SaveBusinessInput>;
  const p = input.profile;
  if (!p || !text(p.id, 80) || !text(p.name, 120) || !text(p.address, 300) || !text(p.phone, 40)) return false;
  if (!BUSINESS_CATEGORIES.includes(p.category) || !text(p.timezone, 80) || !text(p.currency, 8) || !text(p.welcomeMessage, 300)) return false;
  if (!Array.isArray(input.hours) || input.hours.length !== 7 || !input.hours.every((h) => text(h.day, 20) && typeof h.isOpen === 'boolean' && /^\d{2}:\d{2}$/.test(h.opensAt) && /^\d{2}:\d{2}$/.test(h.closesAt))) return false;
  if (!Array.isArray(input.offerings) || input.offerings.length > 100 || !input.offerings.every((o) => text(o.id, 80) && text(o.name, 120) && text(o.category, 80) && typeof o.description === 'string' && o.description.length <= 500 && Number.isFinite(o.price) && o.price >= 0 && (o.durationMinutes === null || (Number.isFinite(o.durationMinutes) && o.durationMinutes > 0)) && typeof o.isAvailable === 'boolean')) return false;
  if (!Array.isArray(input.faqs) || input.faqs.length > 50) return false;
  return input.faqs.every((f) => text(f.id, 80) && text(f.question, 240) && text(f.answer, 1000));
}
export function safeText(value: unknown, max = 500) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
