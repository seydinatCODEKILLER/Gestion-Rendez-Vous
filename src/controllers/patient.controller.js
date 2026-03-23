import patientService from "../services/patient.service.js";
import { deleteMediaByUrl, rollbackUpload, uploadMedia } from "../services/upload.service.js";
import { success } from "../utils/reponse.utils.js";

export const create = async (req, res, next) => {
  let photoUrl = null;
  let photoPrefix = null;
  try {
    if (req.file) {
      photoPrefix = `patient_${Date.now()}`;
      photoUrl = await uploadMedia(req.file, "hackathon/media", photoPrefix);
    }
    const patient = await patientService.createPatient({
      ...req.body,
      photo: photoUrl,
    });
    return success(res, patient, 201, "Patient créé");
  } catch (err) {
    if (photoPrefix) await rollbackUpload(photoPrefix);
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const patients = await patientService.getAll();
    return success(res, patients);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const patient = await patientService.getById(req.params.id);
    return success(res, patient);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  let newPhotoUrl = null;
  let photoPrefix = null;

  try {
    const existingPatient = await patientService.getById(req.params.id);

    if (req.file) {
      photoPrefix = `patient_${Date.now()}`;
      newPhotoUrl = await uploadMedia(req.file, "hackathon/media", photoPrefix);
    }

    const patient = await patientService.updatePatient(req.params.id, {
      ...req.body,
      ...(newPhotoUrl && { photo: newPhotoUrl }),
    });

    if (req.file && existingPatient.photo) {
      await deleteMediaByUrl(existingPatient.photo);
    }

    return success(res, patient, 200, "Patient mis à jour");
  } catch (err) {
    if (photoPrefix) await rollbackUpload(photoPrefix);
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await patientService.remove(req.params.id);
    return success(res, null, 200, "Patient supprimé");
  } catch (err) {
    next(err);
  }
};
