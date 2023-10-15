const Joi = require('joi');

const createTaskSchema = Joi.object({
    title: Joi.string().max(60).required(),
    describe: Joi.string().max(200).allow('').optional(),
});

const updateTaskSchema = Joi.object({
    taskId: Joi.number().integer().required(),
    title: Joi.string().max(60).optional(),
    describe: Joi.string().max(200).allow('').optional(),
}).required().min(1);

module.exports = { createTaskSchema, updateTaskSchema };