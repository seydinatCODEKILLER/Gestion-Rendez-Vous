import rendezVousService from "../services/rv.service.js";
import { success } from "../utils/reponse.utils.js";

export const create = async (req, res, next) => {
  try {
    const rv = await rendezVousService.createRendezVous(req.body);
    return success(res, rv, 201, "Rendez-vous créé");
  } catch (err) {
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const rvs = await rendezVousService.getAll();
    return success(res, rvs);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const rv = await rendezVousService.getById(req.params.id);
    return success(res, rv);
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const rv = await rendezVousService.annulerRendezVous(req.params.id);
    return success(res, rv, 200, "Rendez-vous annulé");
  } catch (err) {
    next(err);
  }
};

export const finish = async (req, res, next) => {
  try {
    const rv = await rendezVousService.terminerRendezVous(req.params.id);
    return success(res, rv, 200, "Rendez-vous terminé");
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await rendezVousService.remove(req.params.id);
    return success(res, null, 200, "Rendez-vous supprimé");
  } catch (err) {
    next(err);
  }
};
