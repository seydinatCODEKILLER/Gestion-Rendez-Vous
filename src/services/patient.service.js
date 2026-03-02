import patientRepo from '../repositories/patient.repository.js';
import HttpError from '../exceptions/http-error.exception.js';

const verifierTelephoneUnique = async (telephone, excludeId = null) => {
  const existing = await patientRepo.findByTelephone(telephone);
  if (existing && existing.id !== excludeId) {
    throw new HttpError('Ce numéro de téléphone est déjà utilisé', 409);
  }
};

const createPatient = async (data) => {
  const { telephone } = data;

  await verifierTelephoneUnique(telephone);

  return patientRepo.create({
    ...data,
    dateNaissance: new Date(data.dateNaissance),
  });
};

const getAllPatients = async () => {
  return patientRepo.findAll();
};

const getPatientById = async (id) => {
  const patient = await patientRepo.findById(id);
  if (!patient) {
    throw new HttpError('Patient introuvable', 404);
  }
  return patient;
};

const updatePatient = async (id, data) => {
  await getPatientById(id);

  if (data.telephone) {
    await verifierTelephoneUnique(data.telephone, id);
  }

  return patientRepo.update(id, {
    ...data,
    ...(data.dateNaissance && { dateNaissance: new Date(data.dateNaissance) }),
  });
};

const supprimerPatient = async (id) => {
  await getPatientById(id);

  const aDesRdv = await patientRepo.hasRendezVous(id);
  if (aDesRdv) {
    throw new HttpError(
      'Impossible de supprimer un patient ayant des rendez-vous',
      400
    );
  }

  return patientRepo.remove(id);
};

export default {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  supprimerPatient,
};