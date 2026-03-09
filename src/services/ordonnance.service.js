import ordonnanceRepo from '../repositories/ordonnance.repository.js';
import prisma from '../config/prisma.js';
import { createBaseService } from './base.service.js';
import HttpError from '../exceptions/http-error.exception.js';

const verifierExistenceRendezVous = async (rendezVousId) => {
  const rv = await prisma.rendezVous.findUnique({
    where: { id: rendezVousId },
  });

  if (!rv) {
    throw new HttpError('Rendez-vous introuvable', 404);
  }

  return rv;
};

const verifierRendezVousTermine = (rv) => {
  if (rv.statut !== 'TERMINE') {
    throw new HttpError(
      'Une ordonnance ne peut être créée que pour un rendez-vous terminé',
      400
    );
  }
};

const verifierOrdonnanceUnique = async (rendezVousId) => {
  const existing = await ordonnanceRepo.findByRendezVousId(rendezVousId);

  if (existing) {
    throw new HttpError(
      'Une ordonnance existe déjà pour ce rendez-vous',
      409
    );
  }
};

const baseService = createBaseService({
  repository: ordonnanceRepo,
  entityName: 'Ordonnance',
});

const createOrdonnance = async (data) => {
  const { rendezVousId, description, dateCreation } = data;

  const rv = await verifierExistenceRendezVous(rendezVousId);
  verifierRendezVousTermine(rv);
  await verifierOrdonnanceUnique(rendezVousId);

  return baseService.create({
    rendezVousId,
    description,
    dateCreation: dateCreation
      ? new Date(dateCreation)
      : new Date(),
  });
};

const getOrdonnanceByRendezVous = async (rendezVousId) => {
  await verifierExistenceRendezVous(rendezVousId);

  const ordonnance =
    await ordonnanceRepo.findByRendezVousId(rendezVousId);

  if (!ordonnance) {
    throw new HttpError(
      'Aucune ordonnance pour ce rendez-vous',
      404
    );
  }

  return ordonnance;
};

const updateOrdonnance = async (id, data) => {
  return baseService.update(id, data);
};

export default {
  ...baseService,
  createOrdonnance,
  getOrdonnanceByRendezVous,
  updateOrdonnance,
};