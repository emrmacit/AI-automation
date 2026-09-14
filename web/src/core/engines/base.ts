import { EngineResponse, SectorMode } from '../types';

export interface DomainEngine {
  readonly sector: SectorMode;
  handleMessage(phone: string, text: string, customerName?: string): Promise<EngineResponse>;
  getOverviewMetrics(): Promise<Record<string, any>>;
}
