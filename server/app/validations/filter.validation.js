const Joi = require('joi');

const filterAll = Joi.object().keys({
    where: Joi.object().default({}),
    attributes: Joi.any().optional(),
    order: Joi.array().items(Joi.array().items(Joi.string())).default([]),
});

const filterSchema = filterAll.keys({
    page: Joi.number().integer().required(),
    size: Joi.number().integer().required(),
}).required().min(1);

const modelFilterSchema = filterSchema.keys({
    modelEmployee: filterAll.default({}),
    modelCurrency: filterAll.default({}),
    modelCountry: filterAll.default({}),
    modelOffice: filterAll.default({}),
});


module.exports = { filterAll, filterSchema, modelFilterSchema };