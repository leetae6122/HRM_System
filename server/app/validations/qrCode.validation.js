const Joi = require('joi');

const createQRCodeSchema = Joi.object({
    attendanceDate: Joi.date().required(),
    shiftId: Joi.number().integer().required(),
});

module.exports = { createQRCodeSchema };