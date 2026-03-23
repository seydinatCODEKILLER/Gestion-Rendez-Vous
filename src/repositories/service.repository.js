import { createBaseRepository } from './base.repository.js';
import prisma from '../config/prisma.js';

const baseRepo = createBaseRepository('service', { medecins: true });

const findByCodeSousService = async (code, sousService) => {
  return prisma.service.findFirst({
    where: { code, sousService },
  });
};

export default {
  ...baseRepo,
  findByCodeSousService,
};