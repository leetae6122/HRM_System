const Joi = require('joi');

const createShiftSchema = Joi.object({
    name: Joi.string().max(60).required(),
    startTime: Joi.string()
        .regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
        .label('startTime fails to match the required pattern hh:mm:ss')
        .required(),
    endTime: Joi.string()
        .regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
        .label('endTime fails to match the required pattern hh:mm:ss')
        .required(),
    overtimeShift: Joi.boolean().optional()
});

const updateShiftSchema = Joi.object({
    shiftId: Joi.number().integer().required(),
    name: Joi.string().max(60).optional(),
    startTime: Joi.string()
        .regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
        .label('startTime fails to match the required pattern hh:mm:ss')
        .optional(),
    endTime: Joi.string()
        .regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)
        .label('endTime fails to match the required pattern hh:mm:ss')
        .optional(),
}).required().min(1);

module.exports = { createShiftSchema, updateShiftSchema };