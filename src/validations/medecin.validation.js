import { z } from "zod";
import { Specialite } from "@prisma/client";

export const createMedecinSchema = z.object({
  prenom: z
    .string({ required_error: "Le prénom est requis" })
    .min(2, "Le prénom doit contenir au moins 2 caractères"),

  nom: z
    .string({ required_error: "Le nom est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  specialite: z.enum(Object.values(Specialite), {
    required_error: "La spécialité est obligatoire",
  }),

  telephone: z
    .string({ required_error: "Le téléphone est requis" })
    .regex(
      /^221(77|78|76|70|75)\d{7}$/,
      "Le téléphone doit commencer par 221 suivi de 77, 78, 76, 70 ou 75 et contenir 7 chiffres"
    ),

  email: z
    .string({ required_error: "L'email est requis" })
    .email("Email invalide"),
});

export const updateMedecinSchema = createMedecinSchema.partial();

export const medecinIdSchema = z.object({
  id: z.string().cuid("ID invalide"),
});