import express from "express";
import * as ordonnanceController from "../controllers/ordonnance.controller.js";

const router = express.Router();

// Test route simple pour vérifier que ça marche
router.get("/test", (req, res) => {
  res.json({ message: "Route ordonnance OK" });
});

// Routes CRUD
router.post("/", ordonnanceController.create);
router.get("/:id", ordonnanceController.getOne);
router.put("/:id", ordonnanceController.update);
router.delete("/:id", ordonnanceController.remove);

export default router;
