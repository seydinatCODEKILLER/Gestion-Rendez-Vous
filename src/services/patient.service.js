import patientRepo from '../repositories/patient.repository.js';
import { createBaseService } from './base.service.js';
import HttpError from '../exceptions/http-error.exception.js';

const verifierTelephoneUnique = async (telephone, excludeId = null) => {
  const existing = await patientRepo.findByTelephone(telephone);

  if (existing && existing.id !== excludeId) {
    throw new HttpError('Ce numéro de téléphone est déjà utilisé', 409);
  }
};

const baseService = createBaseService({
  repository: patientRepo,
  entityName: 'Patient',
  canDelete: async (patient) => {
    const aDesRdv = await patientRepo.hasRendezVous(patient.id);
    if (aDesRdv) {
      throw new HttpError(
        'Impossible de supprimer un patient ayant des rendez-vous',
        400
      );
    }
  },
});

const createPatient = async (data) => {
  await verifierTelephoneUnique(data.telephone);

  return baseService.create({
    ...data,
    dateNaissance: new Date(data.dateNaissance),
  });
};

const updatePatient = async (id, data) => {
  if (data.telephone) {
    await verifierTelephoneUnique(data.telephone, id);
  }

  return baseService.update(id, {
    ...data,
    ...(data.dateNaissance && {
      dateNaissance: new Date(data.dateNaissance),
    }),
  });
};

export default {
  ...baseService,
  createPatient,
  updatePatient,
};