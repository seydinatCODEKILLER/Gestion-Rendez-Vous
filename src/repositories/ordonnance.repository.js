import { createBaseRepository } from './base.repository.js';
import prisma from '../config/prisma.js';

const baseRepo = createBaseRepository('ordonnance', {
  rendezVous: {
    include: {
      medecin: true,
      patient: true,
    },
  },
});

const findByRendezVousId = async (rendezVousId) => {
  return prisma.ordonnance.findUnique({
    where: { rendezVousId },
    include: {
      rendezVous: {
        include: {
          medecin: true,
          patient: true,
        },
      },
    },
  });
};

export default {
  ...baseRepo,
  findByRendezVousId,
};