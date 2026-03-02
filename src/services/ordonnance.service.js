import ordonnanceRepo from '../repositories/ordonnance.repository.js';
import prisma from '../config/prisma.js';
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

const createOrdonnance = async (data) => {
  const { rendezVousId, description, dateCreation } = data;

  const rv = await verifierExistenceRendezVous(rendezVousId);
  verifierRendezVousTermine(rv);
  await verifierOrdonnanceUnique(rendezVousId);

  return ordonnanceRepo.create({
    rendezVousId,
    description,
    dateCreation: dateCreation ? new Date(dateCreation) : new Date(),
  });
};

const getAllOrdonnances = async () => {
  return ordonnanceRepo.findAll();
};

const getOrdonnanceById = async (id) => {
  const ordonnance = await ordonnanceRepo.findById(id);
  if (!ordonnance) {
    throw new HttpError('Ordonnance introuvable', 404);
  }
  return ordonnance;
};

const getOrdonnanceByRendezVous = async (rendezVousId) => {
  await verifierExistenceRendezVous(rendezVousId);

  const ordonnance = await ordonnanceRepo.findByRendezVousId(rendezVousId);
  if (!ordonnance) {
    throw new HttpError('Aucune ordonnance pour ce rendez-vous', 404);
  }
  return ordonnance;
};

const updateOrdonnance = async (id, data) => {
  await getOrdonnanceById(id);
  return ordonnanceRepo.update(id, data);
};

const supprimerOrdonnance = async (id) => {
  await getOrdonnanceById(id);
  return ordonnanceRepo.remove(id);
};

export default {
  createOrdonnance,
  getAllOrdonnances,
  getOrdonnanceById,
  getOrdonnanceByRendezVous,
  updateOrdonnance,
  supprimerOrdonnance,
};