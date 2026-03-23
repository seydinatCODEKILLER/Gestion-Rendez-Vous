import express from "express";
import * as controller from "../controllers/services.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../validations/service.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Gestion des services/pôles
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Créer un service/pôle
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - libelle
 *             properties:
 *               code:
 *                 type: string
 *                 example: "CARD"
 *               libelle:
 *                 type: string
 *                 example: "Cardiologie"
 *               sousService:
 *                 type: string
 *                 example: "Cardio A"
 *     responses:
 *       201:
 *         description: Service créé
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Code + sous-service déjà existant
 */
router.post("/", validate(createServiceSchema), controller.create);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Récupérer la liste de tous les services/pôles
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste des services
 *       404:
 *         description: Aucun service trouvé
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Récupérer un service par ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service trouvé
 *       404:
 *         description: Service introuvable
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Mettre à jour un service/pôle
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "CARD"
 *               libelle:
 *                 type: string
 *                 example: "Cardiologie"
 *               sousService:
 *                 type: string
 *                 example: "Cardio B"
 *     responses:
 *       200:
 *         description: Service mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Service introuvable
 *       409:
 *         description: Code + sous-service déjà existant
 */
router.put("/:id", validate(updateServiceSchema), controller.update);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Supprimer un service/pôle
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service supprimé
 *       400:
 *         description: Impossible de supprimer un service avec médecins rattachés
 *       404:
 *         description: Service introuvable
 */
router.delete("/:id", controller.remove);

export default router;
