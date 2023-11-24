const Joi = require('joi');

const createAllowanceSchema = Joi.object({
    title: Joi.string().max(60).required(),
    amount: Joi.number().min(0).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    employees: Joi.array().items(Joi.string()).required(),
});

const updateAllowanceSchema = Joi.object({
    allowanceId: Joi.number().integer().required(),
    title: Joi.string().max(60).optional(),
    amount: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
}).required().min(1);

module.exports = { createAllowanceSchema, updateAllowanceSchema };