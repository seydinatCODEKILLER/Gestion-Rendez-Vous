import ordonnanceService from '../services/ordonnance.service.js';
import { success } from '../utils/reponse.utils.js';

export const create = async (req, res, next) => {
  try {
    const ordonnance = await ordonnanceService.createOrdonnance(req.body);
    return success(res, ordonnance, 201, 'Ordonnance créée');
  } catch (err) {
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const ordonnances = await ordonnanceService.getAll();
    return success(res, ordonnances);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const ordonnance = await ordonnanceService.getById(req.params.id);
    return success(res, ordonnance);
  } catch (err) {
    next(err);
  }
};

export const findByRendezVous = async (req, res, next) => {
  try {
    const ordonnance = await ordonnanceService.getOrdonnanceByRendezVous(
      req.params.rendezVousId
    );
    return success(res, ordonnance);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const ordonnance = await ordonnanceService.updateOrdonnance(
      req.params.id,
      req.body
    );
    return success(res, ordonnance, 200, 'Ordonnance mise à jour');
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await ordonnanceService.remove(req.params.id);
    return success(res, null, 200, 'Ordonnance supprimée');
  } catch (err) {
    next(err);
  }
};