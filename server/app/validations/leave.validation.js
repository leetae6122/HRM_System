const Joi = require('joi');

const createLeaveSchema = Joi.object().keys({
    title: Joi.string().max(40).required(),
    description: Joi.string().required(),
    leaveFrom: Joi.date().greater('now').required(),
    leaveTo: Joi.date().min(Joi.ref('leaveFrom')).required(),
});

const employeeUpdateLeaveSchema = Joi.object({
    leaveId: Joi.number().integer().required(),
    title: Joi.string().max(40).optional(),
    description: Joi.string().optional(),
    leaveFrom: Joi.date().greater('now').optional(),
    leaveTo: Joi.date().min(Joi.ref('leaveFrom')).optional(),
}).required().min(1);

const employeeCreateLeaveSchema = createLeaveSchema.keys({
    status: Joi.string().default('Pending'),
});

const adminCreateLeaveSchema = createLeaveSchema.keys({
    employeeId: Joi.string().max(10).required(),
    status: Joi.string().default('Approved'),
});

const adminUpdateLeaveSchema = Joi.object({
    leaveId: Joi.number().integer().required(),
    status: Joi.string().valid('Reject', 'Approved').required(),
    reasonRejection: Joi.when('status', {
        is: 'Reject',
        then: Joi.string().required(),
        otherwise: Joi.string().allow(null).default(null)
    })
});

module.exports = {
    employeeUpdateLeaveSchema,
    employeeCreateLeaveSchema,
    adminCreateLeaveSchema,
    adminUpdateLeaveSchema,
};