const Joi = require('joi');

const createProjectSchema = Joi.object({
    title: Joi.string().max(40).required(),
    summary: Joi.string().max(80).required(),
    detail: Joi.string().allow('').optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    status: Joi.string().default('Pending')
});

const updateProjectSchema = Joi.object({
    projectId: Joi.number().integer().required(),
    title: Joi.string().max(40).optional(),
    summary: Joi.string().max(80).optional(),
    detail: Joi.string().allow('').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    status: Joi.string().valid('Upcoming', 'Running', 'Complete').optional()
}).required().min(1);

module.exports = { createProjectSchema, updateProjectSchema };