const Joi = require('joi');

const adminCreateUserSchema = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string()
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required(),
    isAdmin: Joi.boolean().default(false),
    isActived: Joi.boolean().default(false),
    employeeId: Joi.string().guid({
        version: [
            'uuidv4'
        ]
    }).required()
});

const changPasswordSchema = Joi.object({
    currentPassword: Joi.string().max(100).required(),
    newPassword: Joi.string()
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
        .invalid(Joi.ref('currentPassword'))
        .label('The new password must be different from the current password')
});

const adminUpdateUserSchema = Joi.object({
    userId: Joi.string().required(),
    username: Joi.string().max(100).optional(),
    password: Joi.string()
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .optional(),
    isAdmin: Joi.boolean().optional(),
    isActived: Joi.boolean().optional()
}).required().min(1);


module.exports = {
    adminCreateUserSchema,
    changPasswordSchema,
    adminUpdateUserSchema
};