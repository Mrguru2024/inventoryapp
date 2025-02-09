import { z } from 'zod';

export const keySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  keyType: z.string().min(1, "Key type is required"),
  transponderType: z.string().nullable(),
  chipData: z.object({
    id: z.string(),
    name: z.string(),
    frequency: z.string(),
    protocol: z.string(),
  }).nullable(),
  partNumber: z.string().optional(),
  fccId: z.string().optional(),
  icNumber: z.string().optional(),
  frequency: z.string().optional(),
  battery: z.string().optional(),
  buttons: z.array(z.string()).optional(),
  notes: z.string().nullable(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  location: z.string().min(1, "Location is required"),
});

export type KeyFormData = z.infer<typeof keySchema>; 