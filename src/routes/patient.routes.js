import express from "express";
import * as controller from "../controllers/patient.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../validations/patient.validation.js";
import upload from "../middlewares/upload.middleware.js";
import { cleanBodyMiddleware } from "../middlewares/cleanBody.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Gestion des patients
 */

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Créer un patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - dateNaissance
 *               - telephone
 *               - adresse
 *             properties:
 *               prenom:
 *                 type: string
 *                 example: "Amadou"
 *               nom:
 *                 type: string
 *                 example: "Diallo"
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               telephone:
 *                 type: string
 *                 example: "+221771234567"
 *               adresse:
 *                 type: string
 *                 example: "Dakar, Plateau"
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   Photo du patient (jpeg ou png, taille maximale 3 Mo)
 *     responses:
 *       201:
 *         description: Patient créé avec succès
 *       400:
 *         description: Données invalides ou fichier incorrect
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       409:
 *         description: Téléphone déjà utilisé
 */
router.post(
  "/",
  upload.single("photo"),
  validate(createPatientSchema),
  controller.create,
);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Lister tous les patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Liste des patients
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Récupérer un patient par ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient trouvé
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Patient introuvable
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /patients/{id}:
 *   patch:
 *     summary: Mettre à jour un patient
 *     tags: [Patients]
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
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle photo du patient (jpeg/png, max 3 Mo)
 *     responses:
 *       200:
 *         description: Patient mis à jour
 *       400:
 *         description: Données invalides ou fichier incorrect
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Patient introuvable
 *       409:
 *         description: Téléphone déjà utilisé
 */
router.patch(
  "/:id",
  upload.single("photo"),
  cleanBodyMiddleware,
  validate(updatePatientSchema),
  controller.update,
);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Supprimer un patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient supprimé
 *       400:
 *         description: Patient lié à des rendez-vous
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Patient introuvable
 */
router.delete("/:id", controller.remove);

export default router;