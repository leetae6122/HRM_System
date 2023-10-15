const Joi = require('joi');

const filterSchema = Joi.object().keys({
    page: Joi.number().integer().required(),
    size: Joi.number().integer().required(),
    where: Joi.object().default({}),
    attributes: Joi.any().optional(),
    order: Joi.array().items(Joi.array().items(Joi.string())).default([]).optional(),
}).required().min(1);

const modelEmployeeFilterSchema = filterSchema.keys({
    employeeFilter: Joi.object({
        where: Joi.object().default({}).optional(),
        order: Joi.array().items(Joi.array().items(Joi.string())).default([]).optional(),
    }).default(null)
});


module.exports = { filterSchema, modelEmployeeFilterSchema };