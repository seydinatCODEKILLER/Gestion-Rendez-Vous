import { z } from 'zod';

export const createPatientSchema = z.object({
  prenom: z
    .string({ required_error: 'prenom est obligatoire' })
    .min(2, 'prenom doit contenir au moins 2 caractères'),

  nom: z
    .string({ required_error: 'nom est obligatoire' })
    .min(2, 'nom doit contenir au moins 2 caractères'),

  dateNaissance: z
    .string({ required_error: 'dateNaissance est obligatoire' })
    .refine(
      (value) => !isNaN(Date.parse(value)),
      'dateNaissance doit être une date valide'
    )
    .refine(
      (value) => new Date(value) <= new Date(),
      'dateNaissance ne peut pas être dans le futur'
    ),

  telephone: z
    .string({ required_error: 'telephone est obligatoire' })
    .regex(
      /^\+?[\d\s\-]{8,15}$/,
      'telephone invalide (ex: +221771234567)'
    ),

  adresse: z
    .string({ required_error: 'adresse est obligatoire' })
    .min(3, 'adresse doit contenir au moins 3 caractères'),
});

export const updatePatientSchema = createPatientSchema.partial();