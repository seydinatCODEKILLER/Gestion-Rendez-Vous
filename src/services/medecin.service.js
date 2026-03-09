import medecinRepo from '../repositories/medecin.repository.js';
import { createBaseService } from './base.service.js';
import HttpError from '../exceptions/http-error.exception.js';

const baseService = createBaseService({
  repository: medecinRepo,
  entityName: 'Médecin',
  canDelete: (medecin) => {
    if (medecin.rendezVous.length > 0) {
      throw new HttpError(
        'Impossible de supprimer un médecin ayant des rendez-vous',
        400
      );
    }
  },
});

const createMedecin = async (data) => {
  const existing = await medecinRepo.findByEmail(data.email);
  if (existing) {
    throw new HttpError('Un médecin avec cet email existe déjà', 409);
  }

  return baseService.create(data);
};

const updateMedecin = async (id, data) => {
  if (data.email) {
    const existing = await medecinRepo.findByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new HttpError('Email déjà utilisé', 409);
    }
  }

  return baseService.update(id, data);
};

export default {
  ...baseService,
  createMedecin,
  updateMedecin,
};