export interface ScrapedTransponderData {
  make: string;
  model: string;
  yearStart: number;
  yearEnd?: number | null;
  transponderType: string;
  chipType: string[];
  compatibleParts: string[];
  frequency?: string;
  notes?: string;
  dualSystem?: boolean;
}

export interface TransponderImportResult {
  make: string;
  count: number;
  success: boolean;
  error?: string;
} 