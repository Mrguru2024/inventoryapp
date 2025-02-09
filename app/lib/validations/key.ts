import { z } from 'zod';

export const keySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  keyType: z.string().min(1, "Key type is required"),
  transponderType: z.string().nullable(),
  notes: z.string().nullable(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  location: z.string().min(1, "Location is required"),
});

export type KeyFormData = z.infer<typeof keySchema>; 