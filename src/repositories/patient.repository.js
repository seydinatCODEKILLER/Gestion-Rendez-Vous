import { createBaseRepository } from "./base.repository.js";
import prisma from "../config/prisma.js";

const baseRepo = createBaseRepository("patient", {
  rendezVous: true,
});

const findByTelephone = async (telephone) => {
  return prisma.patient.findFirst({
    where: { telephone },
  });
};

const hasRendezVous = async (id) => {
  const count = await prisma.rendezVous.count({
    where: { patientId: id },
  });
  return count > 0;
};

const getLastMatriculeForYear = async (year) => {
  return prisma.patient.findFirst({
    where: {
      matricule: {
        startsWith: `PAT-${year}-`,
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
  findByTelephone,
  hasRendezVous,
  getLastMatriculeForYear
};
