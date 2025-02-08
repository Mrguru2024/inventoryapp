export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  minimumStock: number;
  location: string;
  category: string;
  manufacturer: string;
  model: string;
  description: string;
  imageUrl?: string;
  barcode?: string;
  fccId?: string;
  frequency?: string;
  battery?: string;
  buttons?: string[];
  emergencyKeyCode?: string;
  testKey?: string;
  replacementFor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryFormData {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  minimumStock: number;
  location: string;
  category: string;
  manufacturer: string;
  model: string;
  description: string;
  imageUrl?: string;
  barcode?: string;
  fccId?: string;
  frequency?: string;
  battery?: string;
  buttons?: string[];
  emergencyKeyCode?: string;
  testKey?: string;
  replacementFor?: string;
} 