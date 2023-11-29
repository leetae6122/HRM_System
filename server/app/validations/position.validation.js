const Joi = require('joi');

const createPositionSchema = Joi.object({
    name: Joi.string().max(60).required(),
    minHourlyWage: Joi.number().min(0).default(0),
    maxHourlyWage: Joi.number().min(Joi.ref('minHourlyWage')).optional(),
    departmentId: Joi.number().integer().required(),
});

const updatePositionSchema = Joi.object({
    positionId: Joi.number().integer().required(),
    name: Joi.string().max(60).optional(),
    minHourlyWage: Joi.number().min(0).optional(),
    maxHourlyWage: Joi.number().min(Joi.ref('minHourlyWage')).optional(),
    departmentId: Joi.number().integer().optional(),
}).required().min(1);

module.exports = { createPositionSchema, updatePositionSchema };