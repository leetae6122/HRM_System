const Joi = require('joi');

const createTaskSchema = Joi.object({
    title: Joi.string().max(80).required(),
});

const updateTaskSchema = Joi.object({
    taskId: Joi.number().integer().required(),
    title: Joi.string().max(80).required(),
});

module.exports = { createTaskSchema, updateTaskSchema };