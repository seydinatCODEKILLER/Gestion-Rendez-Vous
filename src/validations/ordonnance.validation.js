import Joi from "joi";

// Validation lors de la création d'une ordonnance
export const createOrdonnanceSchema = Joi.object({
  description: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.empty": "La description est obligatoire",
      "string.min": "La description doit contenir au moins 5 caractères"
    }),
  rendezVousId: Joi.string()
    .required()
    .messages({ "string.empty": "Le rendez-vous est obligatoire" })
});

// Validation lors de la mise à jour
export const updateOrdonnanceSchema = Joi.object({
  description: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.empty": "La description est obligatoire",
      "string.min": "La description doit contenir au moins 5 caractères"
    })
});
