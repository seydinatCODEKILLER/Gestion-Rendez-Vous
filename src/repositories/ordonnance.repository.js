import prisma from "../config/prisma.js";

// Crée une ordonnance
export async function create(data) {
  return prisma.ordonnance.create({ data });
}

// Cherche une ordonnance par ID
export async function findById(id) {
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

// Cherche une ordonnance par rendez-vous (pour éviter doublon)
export async function findByRendezVousId(rendezVousId) {
  return prisma.ordonnance.findUnique({
    where: { rendezVousId }
  });
}

// Met à jour une ordonnance
export async function update(id, data) {
  return prisma.ordonnance.update({
    where: { id },
    data
  });
}

// Supprime une ordonnance
export async function remove(id) {
  return prisma.ordonnance.delete({
    where: { id }
  });
}
