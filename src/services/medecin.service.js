import medecinRepo from "../repositories/medecin.repository.js";
import HttpError from "../exceptions/http-error.exception.js";

const createMedecin = async (data) => {
  const existing = await medecinRepo.findByEmail(data.email);

  if (existing) {
    throw new HttpError("Un médecin avec cet email existe déjà", 409);
  }

  return medecinRepo.create(data);
};

const getAllMedecins = async () => {
  return medecinRepo.findAll();
};

const getMedecinById = async (id) => {
  const medecin = await medecinRepo.findById(id);

  if (!medecin) {
    throw new HttpError("Médecin introuvable", 404);
  }

  return medecin;
};

const updateMedecin = async (id, data) => {
  await getMedecinById(id);

  if (data.email) {
    const existing = await medecinRepo.findByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new HttpError("Email déjà utilisé", 409);
    }
  }

  return medecinRepo.update(id, data);
};

const deleteMedecin = async (id) => {
  const medecin = await getMedecinById(id);

  if (medecin.rendezVous.length > 0) {
    throw new HttpError(
      "Impossible de supprimer un médecin ayant des rendez-vous",
      400
    );
  }

  return medecinRepo.remove(id);
};

export default {
  createMedecin,
  getAllMedecins,
  getMedecinById,
  updateMedecin,
  deleteMedecin,
};