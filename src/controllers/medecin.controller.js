import medecinService from "../services/medecin.service.js";
import { success } from "../utils/reponse.utils.js";

export const create = async (req, res, next) => {
  try {
    const medecin = await medecinService.createMedecin(req.body);
    return success(res, medecin, 201, "Médecin créé");
  } catch (err) {
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const medecins = await medecinService.getAll();
    return success(res, medecins);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const medecin = await medecinService.getById(req.params.id);
    return success(res, medecin);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const medecin = await medecinService.updateMedecin(
      req.params.id,
      req.body
    );
    return success(res, medecin, 200, "Médecin mis à jour");
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await medecinService.remove(req.params.id);
    return success(res, null, 200, "Médecin supprimé");
  } catch (err) {
    next(err);
  }
};