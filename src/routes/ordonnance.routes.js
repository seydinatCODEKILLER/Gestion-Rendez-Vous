import express from 'express';
import * as controller from '../controllers/ordonnance.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createOrdonnanceSchema,
  updateOrdonnanceSchema,
} from '../validations/ordonnance.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ordonnances
 *   description: Gestion des ordonnances médicales
 */

/**
 * @swagger
 * /ordonnances:
 *   post:
 *     summary: Créer une ordonnance
 *     tags: [Ordonnances]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rendezVousId
 *               - description
 *             properties:
 *               rendezVousId:
 *                 type: string
 *                 example: "cku789rendezvous"
 *               description:
 *                 type: string
 *                 example: "Paracétamol 500mg, 3x par jour pendant 5 jours"
 *               dateCreation:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-10"
 *     responses:
 *       201:
 *         description: Ordonnance créée avec succès
 *       400:
 *         description: Rendez-vous non terminé ou données invalides
 *       404:
 *         description: Rendez-vous introuvable
 *       409:
 *         description: Ordonnance déjà existante pour ce rendez-vous
 */
router.post('/', validate(createOrdonnanceSchema), controller.create);

/**
 * @swagger
 * /ordonnances:
 *   get:
 *     summary: Lister toutes les ordonnances
 *     tags: [Ordonnances]
 *     responses:
 *       200:
 *         description: Liste des ordonnances
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /ordonnances/{id}:
 *   get:
 *     summary: Récupérer une ordonnance par ID
 *     tags: [Ordonnances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ordonnance trouvée
 *       404:
 *         description: Ordonnance introuvable
 */
router.get('/:id', controller.findOne);

/**
 * @swagger
 * /ordonnances/{rendezVousId}/rendezvous:
 *   get:
 *     summary: Récupérer l'ordonnance d'un rendez-vous
 *     tags: [Ordonnances]
 *     parameters:
 *       - in: path
 *         name: rendezVousId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ordonnance trouvée
 *       404:
 *         description: Rendez-vous ou ordonnance introuvable
 */
router.get('/:rendezVousId/rendezvous', controller.findByRendezVous);

/**
 * @swagger
 * /ordonnances/{id}:
 *   patch:
 *     summary: Mettre à jour une ordonnance
 *     tags: [Ordonnances]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ordonnance mise à jour
 *       404:
 *         description: Ordonnance introuvable
 */
router.patch('/:id', validate(updateOrdonnanceSchema), controller.update);

/**
 * @swagger
 * /ordonnances/{id}:
 *   delete:
 *     summary: Supprimer une ordonnance
 *     tags: [Ordonnances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ordonnance supprimée
 *       404:
 *         description: Ordonnance introuvable
 */
router.delete('/:id', controller.remove);

export default router;