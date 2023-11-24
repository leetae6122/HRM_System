const Joi = require('joi');

const createShiftSchema = Joi.object({
    name: Joi.string().max(60).required(),
    days: Joi.array().items(Joi.number().integer()).required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    overtimeShift: Joi.boolean().optional()
});

const updateShiftSchema = Joi.object({
    shiftId: Joi.number().integer().required(),
    name: Joi.string().max(60).optional(),
    days: Joi.array().items(Joi.number().integer()).optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    overtimeShift: Joi.boolean().optional()
}).required().min(1);

module.exports = { createShiftSchema, updateShiftSchema };