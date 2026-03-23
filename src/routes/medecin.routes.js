import express from "express";
import * as controller from "../controllers/medecin.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createMedecinSchema,
  updateMedecinSchema,
} from "../validations/medecin.validation.js";
import upload from "../middlewares/upload.middleware.js";
import { cleanBodyMiddleware } from "../middlewares/cleanBody.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Medecins
 *   description: Gestion des médecins
 */

/**
 * @swagger
 * /medecins:
 *   post:
 *     summary: Créer un médecin
 *     tags: [Medecins]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - specialite
 *               - telephone
 *               - email
 *               - serviceId
 *             properties:
 *               prenom:
 *                 type: string
 *                 minLength: 2
 *                 example: "Fatou"
 *               nom:
 *                 type: string
 *                 minLength: 2
 *                 example: "Diop"
 *               specialite:
 *                 type: string
 *                 enum: [GENERALISTE, CARDIOLOGUE, DENTISTE, PEDIATRE, DERMATOLOGUE]
 *                 example: "CARDIOLOGUE"
 *               telephone:
 *                 type: string
 *                 pattern: "^221(77|78|76|70|75)\\d{7}$"
 *                 example: "221771234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "fatou.diop@email.com"
 *               serviceId:
 *                 type: string
 *                 description: ID du service auquel appartient le médecin
 *                 example: "clx8h2p3h0000uk1y8g2k5q7z"
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo du médecin (jpeg/png, max 3 Mo)
 *     responses:
 *       201:
 *         description: Médecin créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Médecin créé avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Medecin'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Service non trouvé
 *       409:
 *         description: Email déjà utilisé
 */
router.post(
  "/",
  upload.single("photo"),
  validate(createMedecinSchema),
  controller.create,
);

/**
 * @swagger
 * /medecins:
 *   get:
 *     summary: Liste des médecins
 *     tags: [Medecins]
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *         description: Filtrer les médecins par service
 *         example: "clx8h2p3h0000uk1y8g2k5q7z"
 *       - in: query
 *         name: includeService
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Inclure les informations du service dans la réponse
 *       - in: query
 *         name: actif
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif/inactif
 *     responses:
 *       200:
 *         description: Liste des médecins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medecin'
 *       400:
 *         description: Paramètres invalides
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /medecins/{id}:
 *   get:
 *     summary: Récupérer un médecin par son ID
 *     tags: [Medecins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médecin
 *         example: "clx8h2p3h0000uk1y8g2k5q7z"
 *     responses:
 *       200:
 *         description: Médecin trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Medecin'
 *       404:
 *         description: Médecin introuvable
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /medecins/{id}:
 *   put:
 *     summary: Mettre à jour un médecin (partiel)
 *     tags: [Medecins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médecin
 *         example: "clx8h2p3h0000uk1y8g2k5q7z"
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *                 minLength: 2
 *                 example: "Fatou"
 *               nom:
 *                 type: string
 *                 minLength: 2
 *                 example: "Diop"
 *               specialite:
 *                 type: string
 *                 enum: [GENERALISTE, CARDIOLOGUE, DENTISTE, PEDIATRE, DERMATOLOGUE]
 *                 example: "CARDIOLOGUE"
 *               telephone:
 *                 type: string
 *                 pattern: "^221(77|78|76|70|75)\\d{7}$"
 *                 example: "221771234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "fatou.diop@email.com"
 *               serviceId:
 *                 type: string
 *                 description: ID du service auquel appartient le médecin
 *                 example: "clx8h2p3h0000uk1y8g2k5q7z"
 *               actif:
 *                 type: boolean
 *                 description: Statut du médecin
 *                 example: true
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle photo du médecin (jpeg/png, max 3 Mo)
 *     responses:
 *       200:
 *         description: Médecin mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Médecin mis à jour avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Medecin'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Médecin ou service introuvable
 *       409:
 *         description: Email déjà utilisé
 */
router.put(
  "/:id",
  upload.single("photo"),
  cleanBodyMiddleware,
  validate(updateMedecinSchema),
  controller.update,
);

/**
 * @swagger
 * /medecins/{id}:
 *   delete:
 *     summary: Supprimer un médecin
 *     tags: [Medecins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médecin
 *         example: "clx8h2p3h0000uk1y8g2k5q7z"
 *     responses:
 *       200:
 *         description: Médecin supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Médecin supprimé avec succès"
 *                 data:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Médecin lié à des rendez-vous
 *       404:
 *         description: Médecin introuvable
 */
router.delete("/:id", controller.remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     Medecin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clx8h2p3h0000uk1y8g2k5q7z"
 *         matricule:
 *           type: string
 *           example: "MED-2026-0001"
 *         prenom:
 *           type: string
 *           example: "Fatou"
 *         nom:
 *           type: string
 *           example: "Diop"
 *         specialite:
 *           type: string
 *           enum: [GENERALISTE, CARDIOLOGUE, DENTISTE, PEDIATRE, DERMATOLOGUE]
 *           example: "CARDIOLOGUE"
 *         telephone:
 *           type: string
 *           example: "221771234567"
 *         email:
 *           type: string
 *           example: "fatou.diop@email.com"
 *         photo:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/..."
 *         actif:
 *           type: boolean
 *           example: true
 *         serviceId:
 *           type: string
 *           example: "clx8h2p3h0000uk1y8g2k5q7z"
 *         service:
 *           $ref: '#/components/schemas/Service'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         libelle:
 *           type: string
 *         sousService:
 *           type: string
 *           nullable: true
 */

export default router;