const Joi = require('joi');

const filterSchema = Joi.object({
    page: Joi.number().integer().required(),
    size: Joi.number().integer().required(),
    where: Joi.object().default({}),
    attributes: Joi.any().optional(),
    order: Joi.array().items(Joi.array().items(Joi.string())).default([]).optional()
}).required().min(1);

module.exports = { filterSchema };