import { z } from 'zod';

export const SubscribeInput = z
  .object({
    email: z.string().email().max(254).transform((s) => s.trim().toLowerCase()),
    slug: z.string().regex(/^[a-z0-9-]{3,64}$/),
    source: z.string().regex(/^[a-z0-9-]{0,64}$/).optional(),
    building: z.enum(['landing', 'brand', 'ppt', 'app', 'none']).optional(),
    consent: z.literal(true).optional(),
    /** `reopen` = existing subscriber only (paid textbook gate). */
    intent: z.enum(['subscribe', 'reopen']).default('subscribe'),
    website: z.string().max(0).optional(),
    turnstile: z.string().min(10),
  })
  .superRefine((data, ctx) => {
    if (data.intent !== 'reopen' && data.consent !== true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['consent'],
        message: 'required',
      });
    }
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

export const ResourceDownload = z.object({
  label: z.string().min(1).max(120),
  key: z.string().min(1).max(512),
});

export const ResourceUpsertInput = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,64}$/),
  title: z.string().min(1).max(200),
  series: z.string().min(1).max(120),
  summary: z.string().min(1).max(1000),
  youtube: z.string().url().max(2048).optional(),
  freeParts: z.number().int().min(0).max(50).default(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  body: z.string().max(200_000),
  downloads: z.array(ResourceDownload).max(20).optional(),
  status: z.enum(['published', 'draft']).default('published'),
});

export type SubscribeInput = z.infer<typeof SubscribeInput>;
export type InquiryInput = z.infer<typeof InquiryInput>;
export type ResourceUpsertInput = z.infer<typeof ResourceUpsertInput>;
export type ResourceDownload = z.infer<typeof ResourceDownload>;
