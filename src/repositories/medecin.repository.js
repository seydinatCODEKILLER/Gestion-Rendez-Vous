import { createBaseRepository } from "./base.repository.js";
import prisma from "../config/prisma.js";

const baseRepo = createBaseRepository("medecin", {
  rendezVous: true,
});

const findByEmail = async (email) => {
  return prisma.medecin.findUnique({
    where: { email },
  });
};

const getLastMatriculeForYear = async (year) => {
  return prisma.patient.findFirst({
    where: {
      matricule: {
        startsWith: `MED-${year}-`,
      },
    },
    orderBy: {
      matricule: "desc",
    },
    select: {
      matricule: true,
    },
  });
};

export default {
  ...baseRepo,
  findByEmail,
  getLastMatriculeForYear,
};