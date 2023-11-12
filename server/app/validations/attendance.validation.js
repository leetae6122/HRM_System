const Joi = require('joi');

const loginAttendanceSchema = Joi.object({
    token: Joi.string().required(),
    inTime: Joi.date().required(),
    employeeId: Joi.string().max(10).required(),
    managerStatus: Joi.string().default('Pending'),
    adminStatus: Joi.string().default('Pending'),
});

const logoutAttendanceSchema = Joi.object({
    attendanceId: Joi.number().integer().required(),
    outTime: Joi.date().required(),
});

const managerUpdateAttendanceSchema = Joi.object({
    attendanceId: Joi.number().integer().required(),
    managerStatus: Joi.string().valid('Reject', 'Approved').required(),
});

const adminUpdateAttendanceSchema = Joi.object({
    attendanceId: Joi.number().integer().required(),
    adminStatus: Joi.string().valid('Reject', 'Approved').required(),
});

module.exports = {
    loginAttendanceSchema,
    logoutAttendanceSchema,
    managerUpdateAttendanceSchema,
    adminUpdateAttendanceSchema,
};