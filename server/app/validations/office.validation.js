const Joi = require('joi');

const createOfficeSchema = Joi.object({
    title: Joi.string().max(40).required(),
    streetAddress: Joi.string().max(100).required(),
    postalCode: Joi.number().integer().max(10).optional(),
    stateProvince: Joi.string().max(30).optional(),
    city: Joi.string().max(30).required(),
    countryId: Joi.number().integer().required(),
});

const updateOfficeSchema = Joi.object({
    officeId: Joi.number().integer().required(),
    title: Joi.string().max(40).optional(),
    streetAddress: Joi.string().max(100).optional(),
    postalCode: Joi.number().integer().max(10).optional(),
    stateProvince: Joi.string().max(30).optional(),
    city: Joi.string().max(30).optional(),
    countryId: Joi.number().integer().optional(),
}).required().min(1);

module.exports = { createOfficeSchema, updateOfficeSchema };