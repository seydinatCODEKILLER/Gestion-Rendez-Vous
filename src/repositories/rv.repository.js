import { createBaseRepository } from './base.repository.js';
import prisma from '../config/prisma.js';

const baseRepo = createBaseRepository('rendezVous', {
  medecin: true,
  patient: true,
  ordonnance: true,
});

const findConflictForMedecin = async (medecinId, date, heure) => {
  return prisma.rendezVous.findFirst({
    where: {
      medecinId,
      date,
      heure,
      statut: 'PLANIFIE',
    },
  });
};

const findConflictForPatient = async (patientId, date, heure) => {
  return prisma.rendezVous.findFirst({
    where: {
      patientId,
      date,
      heure,
      statut: 'PLANIFIE',
    },
  });
};

export default {
  ...baseRepo,
  findConflictForMedecin,
  findConflictForPatient,
};