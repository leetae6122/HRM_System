const Joi = require('joi');

const createPayrollSchema = Joi.object({
    month: Joi.date().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    deduction: Joi.number().min(0).default(0).optional(),
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

const updatePayrollSchema = Joi.object({
    payrollId: Joi.number().integer().required(),
    payDate: Joi.date().optional(),
    deduction: Joi.number().min(0).optional(),
    status: Joi.string().valid('Pending', 'Paid').optional(),
}).required().min(1);

module.exports = { createPayrollSchema, updatePayrollSchema };