const Joi = require('joi');

const createPositionSchema = Joi.object({
    positionName: Joi.string().max(60).required(),
    minSalary: Joi.number().min(0).required().default(0),
    maxSalary: Joi.number().min(0),
    currencyId: Joi.number().integer().required()
});

module.exports = { createPositionSchema };