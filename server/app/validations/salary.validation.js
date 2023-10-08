const Joi = require('joi');

const createSalarySchema = Joi.object({
    basicSalary: Joi.number().min(0).required(),
    allowance: Joi.number().min(0).default(0),
    totalSalary: Joi.number().min(0).optional(),
    currencyId: Joi.number().integer().required(),
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

const updateSalarySchema = Joi.object({
    salaryId: Joi.number().integer().required(),
    basicSalary: Joi.number().min(0).optional(),
    allowance: Joi.number().min(0).optional(),
    totalSalary: Joi.number().min(0).optional(),
    currencyId: Joi.number().integer().optional(),
}).required().min(1);

module.exports = { createSalarySchema, updateSalarySchema };