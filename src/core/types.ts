export const BUSINESS_CATEGORIES = ['Beauty studio', 'Barber', 'Restaurant', 'Real estate', 'Retail', 'Other'] as const;
export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export interface BusinessProfile {
  id: string; name: string; category: BusinessCategory; address: string; phone: string;
  timezone: string; currency: string; welcomeMessage: string;
}
export interface WorkingHour { day: string; isOpen: boolean; opensAt: string; closesAt: string; }
export interface Offering {
  id: string; name: string; category: string; description: string; price: number;
  durationMinutes: number | null; isAvailable: boolean;
}
export interface Faq { id: string; question: string; answer: string; }
export interface Lead {
  id: string; createdAt: string; customerName: string; contact: string; intent: string;
  summary: string; status: 'new' | 'contacted' | 'closed'; source: 'demo' | 'whatsapp';
}
export interface BusinessState {
  profile: BusinessProfile; hours: WorkingHour[]; offerings: Offering[]; faqs: Faq[];
  leads: Lead[]; storage: 'google-sheets' | 'demo-memory';
}
export interface SaveBusinessInput {
  profile: BusinessProfile; hours: WorkingHour[]; offerings: Offering[]; faqs: Faq[];
}
export interface DemoReply { reply: string; leadCreated: boolean; }
