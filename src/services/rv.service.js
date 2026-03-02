import rendezVousRepo from '../repositories/rv.repository.js';
import prisma from '../config/prisma.js';
import HttpError from '../exceptions/http-error.exception.js';

const verifierExistenceMedecin = async (medecinId) => {
  const medecin = await prisma.medecin.findUnique({ where: { id: medecinId } });
  if (!medecin) {
    throw new HttpError('Médecin inexistant', 404);
  }
};

const verifierExistencePatient = async (patientId) => {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new HttpError('Patient inexistant', 404);
  }
};

const verifierDateFuture = (date, heure) => {
  const [year, month, day] = new Date(date)
    .toISOString()
    .split('T')[0]
    .split('-');
  const [hours, minutes] = heure.split(':');

  const dateHeure = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );

  if (dateHeure <= new Date()) {
    throw new HttpError('Le rendez-vous doit être dans le futur', 400);
  }
};

const verifierDisponibilite = async (medecinId, patientId, date, heure) => {
  const dateNormalisee = new Date(new Date(date).toISOString().split('T')[0]);

  const conflitMedecin = await rendezVousRepo.findConflictForMedecin(
    medecinId,
    dateNormalisee,
    heure
  );

  if (conflitMedecin) {
    throw new HttpError(
      'Le médecin a déjà un rendez-vous à cette date/heure',
      409
    );
  }

  const conflitPatient = await rendezVousRepo.findConflictForPatient(
    patientId,
    dateNormalisee,
    heure
  );

  if (conflitPatient) {
    throw new HttpError(
      'Le patient a déjà un rendez-vous à cette date/heure',
      409
    );
  }
};

const createRendezVous = async (data) => {
  const { medecinId, patientId, date, heure } = data;

  await verifierExistenceMedecin(medecinId);
  await verifierExistencePatient(patientId);
  verifierDateFuture(date, heure);
  await verifierDisponibilite(medecinId, patientId, date, heure);

  const dateNormalisee = new Date(new Date(date).toISOString().split('T')[0]);

  return rendezVousRepo.create({
    medecinId,
    patientId,
    date: dateNormalisee,
    heure,
    statut: 'PLANIFIE',
  });
};

const getAllRendezVous = async () => {
  return rendezVousRepo.findAll();
};

const getRendezVousById = async (id) => {
  const rv = await rendezVousRepo.findById(id);
  if (!rv) {
    throw new HttpError('Rendez-vous introuvable', 404);
  }
  return rv;
};

const annulerRendezVous = async (id) => {
  const rv = await getRendezVousById(id);

  if (rv.statut === 'ANNULE') {
    throw new HttpError('Rendez-vous déjà annulé', 400);
  }

  return rendezVousRepo.update(id, { statut: 'ANNULE' });
};

const terminerRendezVous = async (id) => {
  const rv = await getRendezVousById(id);

  if (rv.statut !== 'PLANIFIE') {
    throw new HttpError('Seul un rendez-vous planifié peut être terminé', 400);
  }

  return rendezVousRepo.update(id, { statut: 'TERMINE' });
};

const supprimerRendezVous = async (id) => {
  const rv = await getRendezVousById(id);

  if (rv.ordonnance) {
    throw new HttpError(
      'Impossible de supprimer un rendez-vous lié à une ordonnance',
      400
    );
  }

  return rendezVousRepo.remove(id);
};

export default {
  createRendezVous,
  getAllRendezVous,
  getRendezVousById,
  annulerRendezVous,
  terminerRendezVous,
  supprimerRendezVous,
};
