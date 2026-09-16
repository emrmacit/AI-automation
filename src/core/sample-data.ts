import type { BusinessState } from './types';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const sampleState: BusinessState = {
  profile: {
    id: 'business_demo', name: 'North & Finch Studio', category: 'Beauty studio',
    address: '14 Willow Street, Amsterdam', phone: '+31 20 555 0148',
    timezone: 'Europe/Amsterdam', currency: 'EUR',
    welcomeMessage: 'Welcome to North & Finch. How can we help today?',
  },
  hours: [
    ...weekdays.map((day) => ({ day, isOpen: true, opensAt: '09:00', closesAt: '18:00' })),
    { day: 'Saturday', isOpen: true, opensAt: '10:00', closesAt: '16:00' },
    { day: 'Sunday', isOpen: false, opensAt: '09:00', closesAt: '18:00' },
  ],
  offerings: [
    { id: 'offering_cut', name: 'Signature haircut', category: 'Hair', description: 'Consultation, wash, cut and finish.', price: 48, durationMinutes: 45, isAvailable: true },
    { id: 'offering_colour', name: 'Colour refresh', category: 'Colour', description: 'Root colour refresh with a finished style.', price: 82, durationMinutes: 90, isAvailable: true },
    { id: 'offering_brow', name: 'Brow shape', category: 'Beauty', description: 'Shape and tidy with a short consultation.', price: 24, durationMinutes: 25, isAvailable: true },
  ],
  faqs: [
    { id: 'faq_walkins', question: 'Do you accept walk-ins?', answer: 'Yes, when space allows. Booking ahead is recommended.' },
    { id: 'faq_cancel', question: 'What is your cancellation policy?', answer: 'Please give us at least 24 hours notice.' },
  ],
  leads: [{
    id: 'lead_sample', createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    customerName: 'Sophie', contact: '+31 6 1234 5678', intent: 'Appointment request',
    summary: 'Interested in a signature haircut on Friday afternoon.', status: 'new', source: 'demo',
  }],
  storage: 'demo-memory',
};
