const Joi = require('joi');

const adminCreateUserSchema = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string()
        .max(100)
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
        .required(),
    isAdmin: Joi.boolean().default(false),
    isActive: Joi.boolean().default(false),
    employeeId: Joi.string().required()
});

const changPasswordSchema = Joi.object({
    currentPassword: Joi.string().max(100).required(),
    newPassword: Joi.string()
        .max(100)
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
        .required()
        .invalid(Joi.ref('currentPassword'))
        .label('New Password must be different from your Current Password')
});

const adminUpdateUserSchema = Joi.object({
    userId: Joi.string().required(),
    username: Joi.string().max(100).optional(),
    password: Joi.string()
        .max(100)
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
        .optional(),
    isAdmin: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    employeeId: Joi.string().optional()
}).required().min(1);


module.exports = {
    adminCreateUserSchema,
    changPasswordSchema,
    adminUpdateUserSchema
};