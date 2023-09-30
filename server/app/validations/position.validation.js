const Joi = require('joi');

const createPositionSchema = Joi.object({
    name: Joi.string().max(60).required(),
    minSalary: Joi.number().min(0).default(0),
    maxSalary: Joi.number().min(0).optional(),
    currencyId: Joi.number().integer().required()
});

const updatePositionSchema = Joi.object({
    positionId: Joi.number().integer().required(),
    name: Joi.string().max(60).optional(),
    minSalary: Joi.number().min(0).optional(),
    maxSalary: Joi.number().min(0).optional(),
    currencyId: Joi.number().integer().optional()
}).required().min(1);

module.exports = { createPositionSchema, updatePositionSchema };