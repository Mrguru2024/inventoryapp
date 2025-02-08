import { z } from 'zod';

export const keySchema = z.object({
  partNumber: z.string().min(1, "Part number is required"),
  year: z.string().min(4, "Valid year required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  fccId: z.string().optional(),
  icNumber: z.string().optional(),
  continentalNumber: z.string().optional(),
  frequency: z.string().min(1, "Frequency is required"),
  battery: z.string().min(1, "Battery type is required"),
  emergencyKey: z.string().optional(),
  testKey: z.string().optional(),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  buttons: z.array(z.string()).min(1, "At least one button must be specified"),
  notes: z.string().optional(),
});

export type KeyCreateInput = z.infer<typeof keySchema>; 