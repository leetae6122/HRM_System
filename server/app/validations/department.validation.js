const Joi = require('joi');

const createDepartmentSchema = Joi.object({
    name: Joi.string().max(40).required(),
    shortName: Joi.string().max(8).required(),
    officeId: Joi.number().integer().required(),
    managerId: Joi.string().guid({ version: ['uuidv4'] }).optional(),
});

const updateDepartmentSchema = Joi.object({
    departmentId: Joi.number().integer().required(),
    name: Joi.string().max(40).optional(),
    shortName: Joi.string().max(8).optional(),
    officeId: Joi.number().integer().optional(),
    managerId: Joi.string().guid({ version: ['uuidv4'] }).allow(null).optional(),
}).required().min(1);

module.exports = { createDepartmentSchema, updateDepartmentSchema };