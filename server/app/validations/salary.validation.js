const Joi = require('joi');

const createSalarySchema = Joi.object({
    basicHourlySalary: Joi.number().min(0).required(),
    hourlyOvertimeSalary: Joi.number().greater(Joi.ref('basicHourlySalary')).required(),
    allowance: Joi.number().min(0).default(0),
    currencyId: Joi.number().integer().required(),
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

const updateSalarySchema = Joi.object({
    salaryId: Joi.number().integer().required(),
    basicHourlySalary: Joi.number().min(0).optional(),
    hourlyOvertimeSalary: Joi.number().greater(Joi.ref('basicHourlySalary')).optional(),
    allowance: Joi.number().min(0).optional(),
    currencyId: Joi.number().integer().optional(),
}).required().min(1);

module.exports = { createSalarySchema, updateSalarySchema };