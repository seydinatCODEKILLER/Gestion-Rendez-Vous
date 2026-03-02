import * as ordonnanceService from "../services/ordonnance.service.js";

export async function create(req, res, next) {
  try {
    const result = await ordonnanceService.createOrdonnance(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const result = await ordonnanceService.getOrdonnance(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const result = await ordonnanceService.updateOrdonnance(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await ordonnanceService.deleteOrdonnance(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
