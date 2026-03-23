import patientRepo from '../repositories/patient.repository.js';
import { createBaseService } from './base.service.js';
import HttpError from '../exceptions/http-error.exception.js';
import { deleteMediaByUrl } from './upload.service.js';

const verifierTelephoneUnique = async (telephone, excludeId = null) => {
  const existing = await patientRepo.findByTelephone(telephone);

  if (existing && existing.id !== excludeId) {
    throw new HttpError('Ce numéro de téléphone est déjà utilisé', 409);
  }
};

const generateMatricule = async () => {
  const year = new Date().getFullYear();
  const last = await patientRepo.getLastMatriculeForYear(year);

  let nextNumber = 1;

  if (last?.matricule) {
    const parts = last.matricule.split('-');
    nextNumber = parseInt(parts[2], 10) + 1;
  }

  return `PAT-${year}-${String(nextNumber).padStart(4, '0')}`;
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
  const matricule = await generateMatricule();

  return baseService.create({
    ...data,
    matricule,
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

const removePatient = async (id) => {
  const patient = await patientRepo.findById(id);

  if (!patient) {
    throw new HttpError('Patient introuvable', 404);
  }

  if (patient.photo) {
    await deleteMediaByUrl(patient.photo);
  }

  return baseService.remove(id);
};


export default {
  ...baseService,
  createPatient,
  updatePatient,
  remove: removePatient
};