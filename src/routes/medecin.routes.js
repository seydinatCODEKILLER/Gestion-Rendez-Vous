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
 *                 example: "771234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "fatou.diop@email.com"
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo du médecin (jpeg/png, max 3 Mo)
 *     responses:
 *       201:
 *         description: Médecin créé avec succès
 *       400:
 *         description: Données invalides
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
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /medecins/{id}:
 *   get:
 *     summary: Récupérer un medecin par ID
 *     tags: [Medecins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: medecin trouvé
 *       404:
 *         description: medecin introuvable
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
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               specialite:
 *                 type: string
 *                 enum: [GENERALISTE, CARDIOLOGUE, DENTISTE, PEDIATRE, DERMATOLOGUE]
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle photo du médecin (jpeg/png, max 3 Mo)
 *     responses:
 *       200:
 *         description: Médecin mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Médecin introuvable
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
 *     summary: Supprimer un medecin
 *     tags: [Medecins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medecin supprimé
 *       400:
 *         description: Medecin lié à une ordonnance
 *       404:
 *         description: Medecin introuvable
 */
router.delete("/:id", controller.remove);

export default router;
