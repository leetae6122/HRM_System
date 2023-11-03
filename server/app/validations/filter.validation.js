const Joi = require('joi');

const filterAll = Joi.object().keys({
    where: Joi.object().default({}),
    attributes: Joi.any().optional(),
    order: Joi.array().items(Joi.array().items(Joi.string())).default([]),
});

const filterModel = Joi.object().keys({
    where: Joi.object().optional(),
    order: Joi.array().items(Joi.array().items(Joi.string())).optional(),
});

const filterSchema = filterAll.keys({
    page: Joi.number().integer().required(),
    size: Joi.number().integer().required(),
}).required().min(1);

const modelFilterSchema = filterSchema.keys({
    modelEmployee: filterModel.default({}),
});


module.exports = { filterAll, filterSchema, modelFilterSchema };