import { z } from 'zod';

export const Localized = z.object({
  en: z.string().max(2000).default(''),
  so: z.string().max(2000).default('')
});

export const ExperienceEntry = z.object({
  title: Localized,
  employer: Localized,
  location: Localized.optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  ongoing: z.boolean().default(false),
  bullets: z.array(Localized).max(10)
});

export type LocalizedType = z.infer<typeof Localized>;
