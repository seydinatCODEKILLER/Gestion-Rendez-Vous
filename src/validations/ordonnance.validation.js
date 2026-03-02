const Joi = require("joi");

const createOrdonnanceSchema = Joi.object({
  description: Joi.string().min(5).required(),
  rendezVousId: Joi.string().required()
});

const updateOrdonnanceSchema = Joi.object({
  description: Joi.string().min(5).required()
});

module.exports = {
  createOrdonnanceSchema,
  updateOrdonnanceSchema
};
