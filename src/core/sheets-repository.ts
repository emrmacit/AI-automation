import { createSign } from 'node:crypto';
import { sampleState } from './sample-data';
import type { BusinessState, Faq, Lead, Offering, SaveBusinessInput, WorkingHour } from './types';
import type { BusinessRepository } from './repository';

const API = 'https://sheets.googleapis.com/v4/spreadsheets';
const TABS = ['Business', 'Hours', 'Offerings', 'FAQs', 'Leads'];
const encode = (value: string | Buffer) => Buffer.from(value).toString('base64url');

export class GoogleSheetsRepository implements BusinessRepository {
  constructor(private config: { sheetId: string; email: string; privateKey: string }) {}

  private async token() {
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${encode(JSON.stringify({
      iss: this.config.email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }))}`;
    const signer = createSign('RSA-SHA256');
    signer.update(unsigned);
    const assertion = `${unsigned}.${signer.sign(this.config.privateKey.replace(/\\n/g, '\n'), 'base64url')}`;
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Google authentication failed');
    return (await response.json() as { access_token: string }).access_token;
  }

  private async request(path: string, init?: RequestInit) {
    const response = await fetch(`${API}/${this.config.sheetId}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${await this.token()}`, 'Content-Type': 'application/json', ...init?.headers },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Google Sheets request failed (${response.status})`);
    return response.json();
  }

  private async ensureTabs() {
    const metadata = await this.request('?fields=sheets.properties.title') as { sheets?: { properties: { title: string } }[] };
    const existing = new Set(metadata.sheets?.map((sheet) => sheet.properties.title));
    const missing = TABS.filter((tab) => !existing.has(tab));
    if (missing.length) {
      await this.request(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests: missing.map((title) => ({ addSheet: { properties: { title } } })) }) });
    }
  }

  async getState(): Promise<BusinessState> {
    await this.ensureTabs();
    const query = TABS.map((tab) => `ranges=${encodeURIComponent(`${tab}!A1:H500`)}`).join('&');
    const result = await this.request(`/values:batchGet?${query}`) as { valueRanges?: { range: string; values?: unknown[][] }[] };
    const byTab = new Map(result.valueRanges?.map((range) => [range.range.split('!')[0].replaceAll("'", ''), range.values ?? []]));
    const business = byTab.get('Business') ?? [];
    if (business.length < 2) return { ...structuredClone(sampleState), storage: 'google-sheets' };
    const row = business[1] as string[];
    const hours = (byTab.get('Hours') ?? []).slice(1).map((r) => ({ day: String(r[0] ?? ''), isOpen: String(r[1]).toUpperCase() === 'TRUE', opensAt: String(r[2] ?? '09:00'), closesAt: String(r[3] ?? '18:00') })) as WorkingHour[];
    const offerings = (byTab.get('Offerings') ?? []).slice(1).filter((r) => r[0]).map((r) => ({ id: String(r[0]), name: String(r[1]), category: String(r[2]), description: String(r[3] ?? ''), price: Number(r[4] ?? 0), durationMinutes: r[5] ? Number(r[5]) : null, isAvailable: String(r[6]).toUpperCase() === 'TRUE' })) as Offering[];
    const faqs = (byTab.get('FAQs') ?? []).slice(1).filter((r) => r[0]).map((r) => ({ id: String(r[0]), question: String(r[1]), answer: String(r[2]) })) as Faq[];
    const leads = (byTab.get('Leads') ?? []).slice(1).filter((r) => r[0]).map((r) => ({ id: String(r[0]), createdAt: String(r[1]), customerName: String(r[2]), contact: String(r[3]), intent: String(r[4]), summary: String(r[5]), status: String(r[6]) as Lead['status'], source: String(r[7]) as Lead['source'] })).reverse();
    return {
      profile: { id: String(row[0]), name: String(row[1]), category: row[2] as BusinessState['profile']['category'], address: String(row[3]), phone: String(row[4]), timezone: String(row[5]), currency: String(row[6]), welcomeMessage: String(row[7]) },
      hours: hours.length === 7 ? hours : sampleState.hours,
      offerings, faqs, leads, storage: 'google-sheets',
    };
  }

  async saveBusiness(input: SaveBusinessInput) {
    await this.ensureTabs();
    await this.request('/values:batchClear', { method: 'POST', body: JSON.stringify({ ranges: ['Business!A1:H500', 'Hours!A1:D500', 'Offerings!A1:G500', 'FAQs!A1:C500'] }) });
    const p = input.profile;
    await this.request('/values:batchUpdate', { method: 'POST', body: JSON.stringify({ valueInputOption: 'RAW', data: [
      { range: 'Business!A1:H2', values: [['id', 'name', 'category', 'address', 'phone', 'timezone', 'currency', 'welcomeMessage'], [p.id, p.name, p.category, p.address, p.phone, p.timezone, p.currency, p.welcomeMessage]] },
      { range: `Hours!A1:D${input.hours.length + 1}`, values: [['day', 'isOpen', 'opensAt', 'closesAt'], ...input.hours.map((h) => [h.day, h.isOpen, h.opensAt, h.closesAt])] },
      { range: `Offerings!A1:G${input.offerings.length + 1}`, values: [['id', 'name', 'category', 'description', 'price', 'durationMinutes', 'isAvailable'], ...input.offerings.map((o) => [o.id, o.name, o.category, o.description, o.price, o.durationMinutes ?? '', o.isAvailable])] },
      { range: `FAQs!A1:C${input.faqs.length + 1}`, values: [['id', 'question', 'answer'], ...input.faqs.map((f) => [f.id, f.question, f.answer])] },
    ] }) });
    return this.getState();
  }

  async addLead(lead: Lead) {
    await this.ensureTabs();
    await this.request('/values/Leads!A:H:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', { method: 'POST', body: JSON.stringify({ values: [[lead.id, lead.createdAt, lead.customerName, lead.contact, lead.intent, lead.summary, lead.status, lead.source]] }) });
  }
}
