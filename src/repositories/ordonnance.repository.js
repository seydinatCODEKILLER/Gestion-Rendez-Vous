const prisma = require("../config/prisma");

async function create(data) {
  return prisma.ordonnance.create({
    data
  });
}

async function findById(id) {
  return prisma.ordonnance.findUnique({
    where: { id },
    include: {
      rendezVous: {
        include: {
          patient: true,
          medecin: true
        }
      }
    }
  });
}

async function findByRendezVousId(rendezVousId) {
  return prisma.ordonnance.findUnique({
    where: { rendezVousId }
  });
}

async function update(id, data) {
  return prisma.ordonnance.update({
    where: { id },
    data
  });
}

async function remove(id) {
  return prisma.ordonnance.delete({
    where: { id }
  });
}

module.exports = {
  create,
  findById,
  findByRendezVousId,
  update,
  remove
};
