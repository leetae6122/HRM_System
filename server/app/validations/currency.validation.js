const Joi = require('joi');

const createCurrencySchema = Joi.object({
    name: Joi.string().max(40).required(),
    code: Joi.string().max(20).required(),
    symbol: Joi.string().max(20).allow('').optional()
});

const updateCurrencySchema = Joi.object({
    currencyId: Joi.number().integer().required(),
    name: Joi.string().max(40).optional(),
    code: Joi.string().max(20).optional(),
    symbol: Joi.string().max(20).allow('').optional()
}).required().min(1);

module.exports = { createCurrencySchema, updateCurrencySchema };