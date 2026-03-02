const ordonnanceRepo = require("../repositories/ordonnance.repo");
const rvRepo = require("../repositories/rv.repo");

async function createOrdonnance(data) {

  const rendezVous = await rvRepo.findById(data.rendezVousId);

  if (!rendezVous) {
    throw new Error("Rendez-vous introuvable");
  }

  if (rendezVous.statut !== "TERMINE") {
    throw new Error("Le rendez-vous doit être terminé");
  }

  const existing = await ordonnanceRepo.findByRendezVousId(data.rendezVousId);

  if (existing) {
    throw new Error("Une ordonnance existe déjà pour ce rendez-vous");
  }

  return ordonnanceRepo.create(data);
}

async function getOrdonnance(id) {
  const ordonnance = await ordonnanceRepo.findById(id);

  if (!ordonnance) {
    throw new Error("Ordonnance introuvable");
  }

  return ordonnance;
}

async function updateOrdonnance(id, data) {
  return ordonnanceRepo.update(id, data);
}

async function deleteOrdonnance(id) {
  return ordonnanceRepo.remove(id);
}

module.exports = {
  createOrdonnance,
  getOrdonnance,
  updateOrdonnance,
  deleteOrdonnance
};
