import prisma from '../config/prisma.js';

export const createBaseRepository = (
  modelName,
  defaultInclude = {}
) => {
  const model = prisma[modelName];

  if (!model) {
    throw new Error(`Le modèle Prisma "${modelName}" n'existe pas`);
  }

  return {
    findAll: async () => {
      return model.findMany({
        include: defaultInclude,
      });
    },

    findById: async (id) => {
      return model.findUnique({
        where: { id },
        include: defaultInclude,
      });
    },

    create: async (data) => {
      return model.create({
        data,
        include: defaultInclude,
      });
    },

    update: async (id, data) => {
      return model.update({
        where: { id },
        data,
        include: defaultInclude,
      });
    },

    remove: async (id) => {
      return model.delete({
        where: { id },
      });
    },
  };
};