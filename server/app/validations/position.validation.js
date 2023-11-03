const Joi = require('joi');

const createPositionSchema = Joi.object({
    name: Joi.string().max(60).required(),
    minHourlySalary: Joi.number().min(0).default(0),
    maxHourlySalary: Joi.number().min(Joi.ref('minHourlySalary')).optional(),
});

const updatePositionSchema = Joi.object({
    positionId: Joi.number().integer().required(),
    name: Joi.string().max(60).optional(),
    minHourlySalary: Joi.number().min(0).optional(),
    maxHourlySalary: Joi.number().min(Joi.ref('minHourlySalary')).optional(),
}).required().min(1);

module.exports = { createPositionSchema, updatePositionSchema };