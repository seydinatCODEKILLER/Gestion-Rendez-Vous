import rendezVousRepo from '../repositories/rv.repository.js';
import prisma from '../config/prisma.js';
import { createBaseService } from './base.service.js';
import HttpError from '../exceptions/http-error.exception.js';


const verifierExistenceMedecin = async (medecinId) => {
  const medecin = await prisma.medecin.findUnique({
    where: { id: medecinId },
  });

  if (!medecin) {
    throw new HttpError('Médecin inexistant', 404);
  }
};

const verifierExistencePatient = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

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
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  );

  if (dateHeure <= new Date()) {
    throw new HttpError('Le rendez-vous doit être dans le futur', 400);
  }
};

const verifierDisponibilite = async (medecinId, patientId, date, heure) => {
  const dateNormalisee = new Date(
    new Date(date).toISOString().split('T')[0]
  );

  const conflitMedecin =
    await rendezVousRepo.findConflictForMedecin(
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

  const conflitPatient =
    await rendezVousRepo.findConflictForPatient(
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

const verifierAnnulationPossible = (rv) => {
  if (rv.statut === 'ANNULE') {
    throw new HttpError('Rendez-vous déjà annulé', 400);
  }

  if (rv.statut === 'TERMINE') {
    throw new HttpError(
      'Impossible d’annuler un rendez-vous déjà terminé',
      400
    );
  }
};

const baseService = createBaseService({
  repository: rendezVousRepo,
  entityName: 'Rendez-vous',
  canDelete: (rv) => {
    if (rv.ordonnance) {
      throw new HttpError(
        'Impossible de supprimer un rendez-vous lié à une ordonnance',
        400
      );
    }
  },
});

const createRendezVous = async (data) => {
  const { medecinId, patientId, date, heure } = data;

  await verifierExistenceMedecin(medecinId);
  await verifierExistencePatient(patientId);
  verifierDateFuture(date, heure);
  await verifierDisponibilite(medecinId, patientId, date, heure);

  const dateNormalisee = new Date(
    new Date(date).toISOString().split('T')[0]
  );

  return baseService.create({
    medecinId,
    patientId,
    date: dateNormalisee,
    heure,
    statut: 'PLANIFIE',
  });
};

const annulerRendezVous = async (id) => {
  const rv = await baseService.getById(id);
  verifierAnnulationPossible(rv);
  return baseService.update(id, { statut: 'ANNULE' });
};

const terminerRendezVous = async (id) => {
  const rv = await baseService.getById(id);

  if (rv.statut !== 'PLANIFIE') {
    throw new HttpError(
      'Seul un rendez-vous planifié peut être terminé',
      400
    );
  }

  return baseService.update(id, { statut: 'TERMINE' });
};


export default {
  ...baseService,
  createRendezVous,
  annulerRendezVous,
  terminerRendezVous,
};