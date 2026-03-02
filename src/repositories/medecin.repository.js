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

export default {
  ...baseRepo,
  findByEmail,
};