const Joi = require('joi');

const createWageSchema = Joi.object({
    basicHourlyWage: Joi.number().min(0).required(),
    hourlyOvertimePay: Joi.number().greater(Joi.ref('basicHourlyWage')).required(),
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

const updateWageSchema = Joi.object({
    wageId: Joi.number().integer().required(),
    basicHourlyWage: Joi.number().min(0).optional(),
    hourlyOvertimePay: Joi.number().greater(Joi.ref('basicHourlyWage')).optional(),
    isApplying: Joi.boolean().optional(),
}).required().min(1);

module.exports = { createWageSchema, updateWageSchema };