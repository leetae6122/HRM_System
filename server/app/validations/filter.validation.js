const Joi = require('joi');

const filterAll = Joi.object().keys({
    where: Joi.object().default({}),
    attributes: Joi.any().optional(),
    order: Joi.array().items(Joi.array().items(Joi.string())).default([]).optional(),
}).required().min(1);

const filterSchema = filterAll.keys({
    page: Joi.number().integer().required(),
    size: Joi.number().integer().required(),
}).required().min(1);

const modelEmployeeFilterSchema = filterSchema.keys({
    employeeFilter: Joi.object({
        where: Joi.object().default({}).optional(),
        order: Joi.array().items(Joi.array().items(Joi.string())).default([]).optional(),
    }).default(null)
});


module.exports = { filterAll, filterSchema, modelEmployeeFilterSchema };