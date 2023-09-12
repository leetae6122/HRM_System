const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    isRemember: Joi.boolean()
});

const forgotPasswordSchema = Joi.object({
    username: Joi.string().max(100).required()
});

const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().max(100).required(),
    token: Joi.string().required()
});

module.exports = { 
    loginSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema 
};