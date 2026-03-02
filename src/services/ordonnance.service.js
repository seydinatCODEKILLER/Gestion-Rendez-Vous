import * as ordonnanceRepo from "../repositories/ordonnance.repository.js";

// Crée une ordonnance après vérifications
export async function createOrdonnance(data) {
    const rendezVousId = data.rendezVousId || "rendezvous-temp";
  // Vérifie qu'il n'existe pas déjà une ordonnance pour ce rendez-vous
  const existing = await ordonnanceRepo.findByRendezVousId(data.rendezVousId);
  if (existing) {
    throw new Error("Une ordonnance existe déjà pour ce rendez-vous.");
  }
  return ordonnanceRepo.create(data);
}

// Récupère une ordonnance par ID
export async function getOrdonnance(id) {
  const ordonnance = await ordonnanceRepo.findById(id);
  if (!ordonnance) throw new Error("Ordonnance non trouvée.");
  return ordonnance;
}

// Met à jour une ordonnance
export async function updateOrdonnance(id, data) {
  return ordonnanceRepo.update(id, data);
}

// Supprime une ordonnance
export async function deleteOrdonnance(id) {
  return ordonnanceRepo.remove(id);
}
