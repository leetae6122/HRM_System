const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    isRemember: Joi.boolean().default(false)
});

const forgotPasswordSchema = Joi.object({
    username: Joi.string().max(100).required(),
    email: Joi.string().max(100).required()
});

const resetPasswordSchema = Joi.object({
    newPassword: Joi
        .string()
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required(),
    token: Joi.string().required()
});

module.exports = {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};