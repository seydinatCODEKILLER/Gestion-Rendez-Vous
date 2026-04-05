import express from "express";
import * as controller from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Inscription, connexion et gestion des tokens des administrateurs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un compte administrateur
 *     description: Crée un nouvel utilisateur et renvoie un access token ainsi qu'un refresh token.
 *     tags: [Authentification]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - email
 *               - password
 *             properties:
 *               prenom:
 *                 type: string
 *                 example: "Seydina"
 *               nom:
 *                 type: string
 *                 example: "Thiam"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "seydina.thiam@call221.sn"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MonSuperMotDePasse123"
 *     responses:
 *       201:
 *         description: Compte créé avec succès. Utilisez le accessToken pour les requêtes suivantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       example: "$2a$10$Xk..."
 *       400:
 *         description: Données invalides (mot de passe trop court, email mal formaté...)
 *       409:
 *         description: Conflit (cet email est déjà utilisé par un autre compte)
 */
router.post("/register", validate(registerSchema), controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter
 *     description: Authentifie un utilisateur et renvoie un nouveau couple de tokens.
 *     tags: [Authentification]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "seydina.thiam@call221.sn"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MonSuperMotDePasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Identifiants invalides (email ou mot de passe incorrect)
 */
router.post("/login", validate(loginSchema), controller.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le jeton d'accès
 *     description: >
 *       À utiliser quand l'access token est expiré (Erreur 401).
 *       Envoie un refresh token valide pour obtenir un nouveau couple de tokens.
 *       (Rotation des tokens : l'ancien refresh token sera invalidé).
 *     tags: [Authentification]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "$2a$10$Xk..."
 *     responses:
 *       200:
 *         description: Tokens rafraîchis avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Refresh token invalide, expiré ou déjà utilisé
 */
router.post("/refresh-token", validate(refreshTokenSchema), controller.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Se déconnecter
 *     description: Invalide le refresh token en base de données. L'access token expirera de lui-même.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "$2a$10$Xk..."
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 *       401:
 *         description: Non authentifié (Access token manquant ou invalide dans le header)
 */
router.post("/logout", authenticate, controller.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer mon profil
 *     description: Renvoie les informations de l'utilisateur actuellement connecté (via son access token).
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur connecté.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx1234567890"
 *                     prenom:
 *                       type: string
 *                       example: "Seydina"
 *                     nom:
 *                       type: string
 *                       example: "Thiam"
 *                     email:
 *                       type: string
 *                       example: "seydina.thiam@call221.sn"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Non authentifié (Access token manquant ou invalide)
 *       404:
 *         description: Utilisateur introuvable (compte supprimé entretemps)
 */
router.get("/me", authenticate, controller.me);

export default router;
