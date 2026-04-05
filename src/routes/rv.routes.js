import express from "express";
import * as controller from "../controllers/rv.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createRendezVousSchema } from "../validations/rv.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RendezVous
 *   description: Gestion des rendez-vous médicaux
 */

/**
 * @swagger
 * /rendezvous:
 *   post:
 *     summary: Créer un rendez-vous
 *     tags: [RendezVous]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medecinId
 *               - patientId
 *               - date
 *               - heure
 *             properties:
 *               medecinId:
 *                 type: string
 *                 example: "cku123medecin"
 *               patientId:
 *                 type: string
 *                 example: "cku456patient"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-10"
 *               heure:
 *                 type: string
 *                 example: "10:30"
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Médecin ou patient introuvable
 *       409:
 *         description: Conflit de disponibilité
 */
router.post("/", validate(createRendezVousSchema), controller.create);

/**
 * @swagger
 * /rendezvous:
 *   get:
 *     summary: Lister tous les rendez-vous
 *     tags: [RendezVous]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /rendezvous/{id}:
 *   get:
 *     summary: Récupérer un rendez-vous par ID
 *     tags: [RendezVous]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous trouvé
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Rendez-vous introuvable
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /rendezvous/{id}:
 *   delete:
 *     summary: Supprimer un rendez-vous
 *     tags: [RendezVous]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous supprimé
 *       400:
 *         description: Rendez-vous lié à une ordonnance
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Rendez-vous introuvable
 */
router.delete("/:id", controller.remove);

/**
 * @swagger
 * /rendezvous/{id}/annuler:
 *   patch:
 *     summary: Annuler un rendez-vous
 *     tags: [RendezVous]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous annulé
 *       400:
 *         description: État invalide
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Rendez-vous introuvable
 */
router.patch("/:id/annuler", controller.cancel);

/**
 * @swagger
 * /rendezvous/{id}/terminer:
 *   patch:
 *     summary: Marquer un rendez-vous comme terminé
 *     tags: [RendezVous]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous terminé
 *       400:
 *         description: État invalide
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       404:
 *         description: Rendez-vous introuvable
 */
router.patch("/:id/terminer", controller.finish);

export default router;