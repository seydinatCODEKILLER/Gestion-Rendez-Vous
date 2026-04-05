import { z } from "zod";

export const registerSchema = z.object({
  prenom: z.string().min(1, "Le prénom est obligatoire"),
  nom: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Le refresh token est obligatoire"),
});
