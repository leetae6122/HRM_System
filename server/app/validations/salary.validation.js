const Joi = require('joi');

const createSalarySchema = Joi.object({
    basicSalary: Joi.number().min(0).required(),
    allowance: Joi.number().min(0).required().default(0),
    totalSalary: Joi.number().min(0).required().default(() => Joi.ref('basicSalary') + Joi.ref('allowance')),
    currencyId: Joi.number().integer().required(),
    employeeId: Joi.string().required()
});

module.exports = { createSalarySchema };