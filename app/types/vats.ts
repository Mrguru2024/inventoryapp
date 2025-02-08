export interface VatsResistorValue {
  code: string;
  ohms: string;
  value: number;
}

export interface VatsVehicle {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  system: "VATS" | "PassKey-1" | "PassKey-2";
}

export const VATS_RESISTOR_VALUES: VatsResistorValue[] = [
  { value: 1, code: "N/A", ohms: "402 Ω" },
  { value: 2, code: "CN", ohms: "523 Ω" },
  { value: 3, code: "FW", ohms: "681 Ω" },
  { value: 4, code: "GP", ohms: "887 Ω" },
  { value: 5, code: "KA", ohms: "1.13 kΩ" },
  { value: 6, code: "N5", ohms: "1.47 kΩ" },
  { value: 7, code: "UN", ohms: "1.87 kΩ" },
  { value: 8, code: "XB", ohms: "2.37 kΩ" },
  { value: 9, code: "GA", ohms: "3.01 kΩ" },
  { value: 10, code: "NP", ohms: "3.74 kΩ" },
  { value: 11, code: "FY", ohms: "4.75 kΩ" },
  { value: 12, code: "C5", ohms: "6.04 kΩ" },
  { value: 13, code: "XY", ohms: "7.50 kΩ" },
  { value: 14, code: "KB", ohms: "9.53 kΩ" },
  { value: 15, code: "UW", ohms: "11.80 kΩ" }
]; 