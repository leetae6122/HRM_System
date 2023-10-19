const Joi = require('joi');

const createPayrollSchema = Joi.object({
    month: Joi.date().required(),
    hoursWorked: Joi.number().min(0).max(200).required(),
    hoursOvertime: Joi.number().min(0).max(50).optional(),
    totalPaid: Joi.number().min(0).required(),
    payDate: Joi.date().optional(),
    status: Joi.string().valid('Pending', 'Paid').default('Pending').optional(),
    salaryId: Joi.number().integer().required(),
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

const updatePayrollSchema = Joi.object({
    payrollId: Joi.number().integer().required(),
    payDate: Joi.date().optional(),
    status: Joi.string().valid('Pending', 'Paid').optional(),
}).required().min(1);

module.exports = { createPayrollSchema, updatePayrollSchema };