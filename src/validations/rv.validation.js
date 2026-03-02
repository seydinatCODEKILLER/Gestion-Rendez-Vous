import { z } from 'zod';

export const createRendezVousSchema = z.object({
  medecinId: z
    .string({ required_error: 'medecinId est obligatoire' })
    .min(1, 'medecinId invalide'),

  patientId: z
    .string({ required_error: 'patientId est obligatoire' })
    .min(1, 'patientId invalide'),

  date: z
    .string({ required_error: 'date est obligatoire' })
    .refine(
      (value) => !isNaN(Date.parse(value)),
      'date doit être une date valide (ex: 2026-04-10)'
    ),

  heure: z
    .string({ required_error: 'heure est obligatoire' })
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'heure doit être au format HH:MM (ex: 10:30)'
    ),
});