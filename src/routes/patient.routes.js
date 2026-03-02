import express from 'express';
import * as controller from '../controllers/patient.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { createPatientSchema, updatePatientSchema } from '../validations/patient.validation.js';

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
 *         application/json:
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
 *     responses:
 *       201:
 *         description: Patient créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Téléphone déjà utilisé
 */
router.post('/', validate(createPatientSchema), controller.create);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Lister tous les patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Liste des patients
 */
router.get('/', controller.findAll);

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
 *       404:
 *         description: Patient introuvable
 */
router.get('/:id', controller.findOne);

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
 *       content:
 *         application/json:
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
 *     responses:
 *       200:
 *         description: Patient mis à jour
 *       404:
 *         description: Patient introuvable
 *       409:
 *         description: Téléphone déjà utilisé
 */
router.patch('/:id', validate(updatePatientSchema), controller.update);

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
 *       404:
 *         description: Patient introuvable
 */
router.delete('/:id', controller.remove);

export default router;