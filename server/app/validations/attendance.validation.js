const Joi = require('joi');

const inTimeAttendanceSchema = Joi.object().keys({
    attendanceDate: Joi.date().required(),
    inTime: Joi.string()
        .regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
        .label('inTime fails to match the required pattern hh:mm:ss')
        .required(),
    shiftId: Joi.number().integer().required(),
    managerStatus: Joi.string().default('Pending'),
    adminStatus: Joi.string().default('Pending'),
});

const outTimeAttendanceSchema = Joi.object({
    attendanceId: Joi.number().integer().required(),
    outTime: Joi.string()
        .regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
        .label('outTime fails to match the required pattern hh:mm:ss')
        .required(),
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
    inTimeAttendanceSchema,
    outTimeAttendanceSchema,
    managerUpdateAttendanceSchema,
    adminUpdateAttendanceSchema,
};