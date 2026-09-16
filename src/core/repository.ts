import { sampleState } from './sample-data';
import type { BusinessState, Lead, SaveBusinessInput } from './types';
import { GoogleSheetsRepository } from './sheets-repository';

export interface BusinessRepository {
  getState(): Promise<BusinessState>;
  saveBusiness(input: SaveBusinessInput): Promise<BusinessState>;
  addLead(lead: Lead): Promise<void>;
}
class MemoryRepository implements BusinessRepository {
  private state: BusinessState = structuredClone(sampleState);
  async getState() { return structuredClone(this.state); }
  async saveBusiness(input: SaveBusinessInput) {
    this.state = { ...structuredClone(input), leads: this.state.leads, storage: 'demo-memory' };
    return this.getState();
  }
  async addLead(lead: Lead) { this.state.leads.unshift(structuredClone(lead)); }
}
const memory = new MemoryRepository();
let sheets: GoogleSheetsRepository | null = null;
export function getRepository(): BusinessRepository {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!sheetId || !email || !privateKey) return memory;
  sheets ??= new GoogleSheetsRepository({ sheetId, email, privateKey });
  return sheets;
}
