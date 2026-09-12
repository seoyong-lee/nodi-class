import { z } from 'zod';

export const SubscribeInput = z.object({
  email: z.string().email().max(254).transform((s) => s.trim().toLowerCase()),
  slug: z.string().regex(/^[a-z0-9-]{3,64}$/),
  source: z.string().regex(/^[a-z0-9-]{0,64}$/).optional(),
  building: z.enum(['landing', 'brand', 'ppt', 'app', 'none']).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  turnstile: z.string().min(10),
});

export const InquiryInput = z.object({
  name: z.string().min(1).max(40),
  email: z.string().email(),
  resultUrl: z.string().url().max(2048),
  blocked: z.string().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  turnstile: z.string().min(10),
});

export type SubscribeInput = z.infer<typeof SubscribeInput>;
export type InquiryInput = z.infer<typeof InquiryInput>;
