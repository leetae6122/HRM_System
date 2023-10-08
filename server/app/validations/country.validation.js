const Joi = require('joi');

const createCountrySchema = Joi.object({
    name: Joi.string().max(30).required(),
    countryCode: Joi.number().integer().min(1).required(),
    isoCode: Joi.string().max(10).required()
});

const updateCountrySchema = Joi.object({
    countryId: Joi.number().integer().required(),
    name: Joi.string().max(30).optional(),
    countryCode: Joi.number().integer().min(1).optional(),
    isoCode: Joi.string().max(10).optional()
}).required().min(1);

module.exports = { createCountrySchema, updateCountrySchema };