const Joi = require('joi');

const createLeaveSchema = Joi.object().keys({
    title: Joi.string().max(60).required(),
    description: Joi.string().required(),
    leaveFrom: Joi.date().greater('now').required(),
    leaveTo: Joi.date().min(Joi.ref('leaveFrom')).required(),
});

const employeeCreateLeaveSchema = createLeaveSchema.keys({
    status: Joi.string().default('Pending'),
});

const adminCreateLeaveSchema = createLeaveSchema.keys({
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    status: Joi.string().default('Approve'),
});

const adminUpdateLeaveSchema = Joi.object({
    leaveId: Joi.number().integer().required(),
    status: Joi.string().valid('Reject', 'Approve').required(),
    reasonRejection: Joi.when('status', {
        is: 'Reject',
        then: Joi.string().required(),
        otherwise: Joi.any().default(null)
    })
});

module.exports = {
    employeeCreateLeaveSchema,
    adminCreateLeaveSchema,
    adminUpdateLeaveSchema
};