import medecinRepo from "../repositories/medecin.repository.js";
import serviceRepo from "../repositories/service.repository.js";
import { createBaseService } from "./base.service.js";
import HttpError from "../exceptions/http-error.exception.js";
import { deleteMediaByUrl } from "./upload.service.js";

const generateMatricule = async () => {
  const year = new Date().getFullYear();
  const last = await medecinRepo.getLastMatriculeForYear(year);

  let nextNumber = 1;

  if (last?.matricule) {
    const parts = last.matricule.split("-");
    nextNumber = parseInt(parts[2], 10) + 1;
  }

  return `MED-${year}-${String(nextNumber).padStart(4, "0")}`;
};

const baseService = createBaseService({
  repository: medecinRepo,
  entityName: "Médecin",
  canDelete: (medecin) => {
    if (medecin.rendezVous.length > 0) {
      throw new HttpError(
        "Impossible de supprimer un médecin ayant des rendez-vous",
        400,
      );
    }
  },
});

const createMedecin = async (data) => {
  const existing = await medecinRepo.findByEmail(data.email);
  if (existing) {
    throw new HttpError("Un médecin avec cet email existe déjà", 409);
  }

  const service = await serviceRepo.findById(data.serviceId);
  if (!service) throw new HttpError("Service introuvable", 404);

  const matricule = await generateMatricule();

  return baseService.create({
    ...data,
    matricule,
  });
};

const updateMedecin = async (id, data) => {
  if (data.email) {
    const existing = await medecinRepo.findByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new HttpError("Email déjà utilisé", 409);
    }
  }

  if (data.serviceId) {
    const service = await serviceRepo.findById(data.serviceId);
    if (!service) throw new HttpError("Service introuvable", 404);
  }

  return baseService.update(id, data);
};

const removeMedecin = async (id) => {
  const medecin = await medecinRepo.findById(id);

  if (!medecin) {
    throw new HttpError("Medecin introuvable", 404);
  }

  if (medecin.photo) {
    await deleteMediaByUrl(medecin.photo);
    console.log("suppression réussie");
    
  }

  return baseService.remove(id);
};

export default {
  ...baseService,
  createMedecin,
  updateMedecin,
  remove: removeMedecin,
};
