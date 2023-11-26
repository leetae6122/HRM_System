const Joi = require('joi');

const createDepartmentSchema = Joi.object({
    name: Joi.string().max(40).required(),
    shortName: Joi.string().max(8).required(),
    managerEId: Joi.string().max(10).optional(),
});

const updateDepartmentSchema = Joi.object({
    departmentId: Joi.number().integer().required(),
    name: Joi.string().max(40).optional(),
    shortName: Joi.string().max(8).optional(),
    managerEId: Joi.string().max(10).allow('').optional(),
}).required().min(1);

module.exports = { createDepartmentSchema, updateDepartmentSchema };