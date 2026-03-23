import medecinService from "../services/medecin.service.js";
import { deleteMediaByUrl, rollbackUpload, uploadMedia } from "../services/upload.service.js";
import { success } from "../utils/reponse.utils.js";

export const create = async (req, res, next) => {
  let photoUrl = null;
  let photoPrefix = null;
  try {
    if (req.file) {
      photoPrefix = `medecin_${Date.now()}`;
      photoUrl = await uploadMedia(req.file, "hackathon/media", photoPrefix);
    }
    const medecin = await medecinService.createMedecin({
      ...req.body,
      photo: photoUrl,
    });
    return success(res, medecin, 201, "Médecin créé");
  } catch (err) {
    if (photoPrefix) await rollbackUpload(photoPrefix);
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const medecins = await medecinService.getAll();
    return success(res, medecins);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const medecin = await medecinService.getById(req.params.id);
    return success(res, medecin);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  let newPhotoUrl = null;
  let photoPrefix = null;
  try {
    const existingMedecin = await medecinService.getById(req.params.id);
    if (req.file) {
      photoPrefix = `medecin_${Date.now()}`;
      newPhotoUrl = await uploadMedia(req.file, "hackathon/media", photoPrefix);
    }

    const medecin = await medecinService.updateMedecin(req.params.id, {
      ...req.body,
      ...(newPhotoUrl && { photo: newPhotoUrl }),
    });

    if (req.file && existingMedecin.photo) {
      await deleteMediaByUrl(existingMedecin.photo);
    }
    return success(res, medecin, 200, "Médecin mis à jour");
  } catch (err) {
    if (photoPrefix) await rollbackUpload(photoPrefix);
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await medecinService.remove(req.params.id);
    return success(res, null, 200, "Médecin supprimé");
  } catch (err) {
    next(err);
  }
};
