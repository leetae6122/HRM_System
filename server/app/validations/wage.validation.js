const Joi = require('joi');

const createWageSchema = Joi.object({
    basicHourlyWage: Joi.number().min(0).required(),
    fromDate: Joi.date().required(),
    employeeId: Joi.string().max(10).required(),
});

const updateWageSchema = Joi.object({
    wageId: Joi.number().integer().required(),
    basicHourlyWage: Joi.number().min(0).optional(),
    fromDate: Joi.date().optional(),
    toDate: Joi.date().optional(),
}).required().min(1);

module.exports = { createWageSchema, updateWageSchema };