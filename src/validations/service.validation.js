import { z } from 'zod';

export const createServiceSchema = z.object({
  code: z.string({ required_error: 'Code obligatoire' }).min(1),
  libelle: z.string({ required_error: 'Libellé obligatoire' }).min(2),
  sousService: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();