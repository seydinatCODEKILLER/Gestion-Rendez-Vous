import serviceService from "../services/services.service.js";
import { success } from "../utils/reponse.utils.js";

export const create = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);
    return success(res, service, 201, "Service créé");
  } catch (err) {
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const services = await serviceService.getAll();
    return success(res, services);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const service = await serviceService.getById(req.params.id);
    return success(res, service);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    return success(res, service, 200, "Service mis à jour");
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await serviceService.remove(req.params.id);
    return success(res, null, 200, "Service supprimé");
  } catch (err) {
    next(err);
  }
};
