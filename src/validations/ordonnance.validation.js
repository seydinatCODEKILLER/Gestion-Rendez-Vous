import { z } from 'zod';

export const createOrdonnanceSchema = z.object({
  rendezVousId: z
    .string({ required_error: 'rendezVousId est obligatoire' })
    .min(1, 'rendezVousId invalide'),

  description: z
    .string({ required_error: 'description est obligatoire' })
    .min(5, 'description doit contenir au moins 5 caractères'),

  dateCreation: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      'dateCreation doit être une date valide'
    )
    .optional(),
});

export const updateOrdonnanceSchema = z.object({
  description: z
    .string()
    .min(5, 'description doit contenir au moins 5 caractères')
    .optional(),
});