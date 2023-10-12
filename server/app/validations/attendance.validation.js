const Joi = require('joi');

const createAttendanceSchema = Joi.object().keys({
    description: Joi.string().max(255).required(),
    attendanceDate: Joi.date().required(),
    hourSpent: Joi.number().max(8).required(),
    hourOT: Joi.number().max(2).optional(),
    status: Joi.string().default('Pending'),
    place: Joi.string().valid('Office', 'At Home').required(),
    taskId: Joi.number().integer().required(),
    projectId: Joi.number().integer().required()
});

const employeeUpdateAttendanceSchema = Joi.object({
    attendanceId: Joi.number().integer().required(),
    description: Joi.string().max(255).optional(),
    attendanceDate: Joi.date().optional(),
    hourSpent: Joi.number().max(8).optional(),
    hourOT: Joi.number().max(2).optional(),
    place: Joi.string().valid('Office', 'At Home').optional(),
    taskId: Joi.number().integer().optional(),
    projectId: Joi.number().integer().optional()
}).required().min(1);

const adminUpdateAttendanceSchema = Joi.object({
    attendanceId: Joi.number().integer().required(),
    status: Joi.string().valid('Reject', 'Approved').required(),
});

module.exports = {
    employeeUpdateAttendanceSchema,
    createAttendanceSchema,
    adminUpdateAttendanceSchema,
};