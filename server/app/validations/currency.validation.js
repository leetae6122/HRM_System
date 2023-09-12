const Joi = require('joi');

const createCurrencySchema = Joi.object({
    name: Joi.string().max(40).required(),
    code: Joi.string().max(20).required(),
    symbol: Joi.string().max(20)
});

module.exports = { createCurrencySchema };