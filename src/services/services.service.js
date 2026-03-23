import serviceRepo from "../repositories/service.repository.js";
import { createBaseService } from "./base.service.js";
import HttpError from "../exceptions/http-error.exception.js";

const baseService = createBaseService({
  repository: serviceRepo,
  entityName: "Service",
  canDelete: async (service) => {
    if (service.medecins.length > 0) {
      throw new HttpError(
        "Impossible de supprimer un service ayant des médecins rattachés",
        400,
      );
    }
  },
});

const createService = async (data) => {
  const existing = await serviceRepo.findByCodeSousService(
    data.code,
    data.sousService || null,
  );
  if (existing)
    throw new HttpError(
      "Un service avec ce code et sous-service existe déjà",
      409,
    );

  return baseService.create(data);
};

const updateService = async (id, data) => {
  if (data.code || data.sousService) {
    const existing = await serviceRepo.findByCodeSousService(
      data.code,
      data.sousService || null,
    );
    if (existing && existing.id !== id)
      throw new HttpError(
        "Un service avec ce code et sous-service existe déjà",
        409,
      );
  }

  return baseService.update(id, data);
};

export default {
  ...baseService,
  createService,
  updateService,
};
