import patientService from '../services/patient.service.js';
import { success } from '../utils/reponse.utils.js';

export const create = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.body);
    return success(res, patient, 201, 'Patient créé');
  } catch (err) {
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const patients = await patientService.getAllPatients();
    return success(res, patients);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    return success(res, patient);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);
    return success(res, patient, 200, 'Patient mis à jour');
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await patientService.supprimerPatient(req.params.id);
    return success(res, null, 200, 'Patient supprimé');
  } catch (err) {
    next(err);
  }
};