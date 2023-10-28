const Joi = require('joi');

const attendanceByShiftSchema = Joi.object({
    attendanceDate: Joi.date().required(),
    shiftId: Joi.number().integer().required(),
});

const inTimeAttendanceSchema = Joi.object({
    attendanceDate: Joi.date().required(),
    inTime: Joi.date().required(),
    shiftId: Joi.number().integer().required(),
    managerStatus: Joi.string().default('Pending'),
    adminStatus: Joi.string().default('Pending'),
});

const outTimeAttendanceSchema = Joi.object({
    attendanceDate: Joi.date().required(),
    outTime: Joi.date().required(),
    shiftId: Joi.number().integer().required(),
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
    attendanceByShiftSchema,
    inTimeAttendanceSchema,
    outTimeAttendanceSchema,
    managerUpdateAttendanceSchema,
    adminUpdateAttendanceSchema,
};