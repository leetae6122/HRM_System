const Joi = require('joi');

const createSalarySchema = Joi.object({
    basicSalary: Joi.number().min(0).required(),
    allowance: Joi.number().min(0).default(0),
    totalSalary: Joi.number().min(0).default(() => Joi.ref('basicSalary') + Joi.ref('allowance')),
    currencyId: Joi.number().integer().required(),
    employeeId: Joi.string().required()
});

const updateSalarySchema = Joi.object({
    salaryId: Joi.number().integer().required(),
    basicSalary: Joi.string().min(0).optional(),
    allowance: Joi.string().min(0).optional(),
    totalSalary: Joi.string().min(0).optional(),
    currencyId: Joi.number().integer().optional(),
}).required().min(1);

module.exports = { createSalarySchema, updateSalarySchema };