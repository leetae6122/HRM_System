const Joi = require('joi');

const adminCreateEmployeeSchema = Joi.object({
    firstName: Joi.string().max(80).required(),
    lastName: Joi.string().max(80).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).max(100).required(),
    phoneNumber: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
        .required(),
    gender: Joi.boolean().truthy('male').falsy('female').required(),
    address: Joi.string().required(),
    dateBirth: Joi.date().less('now').required(),
    dateHired: Joi.date().max('now'),
    avatar: Joi.any().optional(),
    positionId: Joi.number().integer().required(),
});

const updateEmployeeSchema = Joi.object().keys({
    phoneNumber: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
        .optional(),
    address: Joi.string().optional(),
    dateBirth: Joi.date().less('now').optional(),
}).required().min(1);

const adminUpdateEmployeeSchema = updateEmployeeSchema.keys({
    employeeId: Joi.string().required(),
    firstName: Joi.string().max(80).optional(),
    lastName: Joi.string().max(80).optional(),
    email: Joi.string().email({ minDomainSegments: 2 }).max(100).optional(),
    gender: Joi.boolean().truthy('male').falsy('female').optional(),
    dateHired: Joi.date().max('now').optional(),
    dateOff: Joi.date().allow(null).optional(),
    avatar: Joi.any().optional(),
    positionId: Joi.number().integer().optional()
}).required().min(1);

module.exports = { 
    adminCreateEmployeeSchema, 
    updateEmployeeSchema, 
    adminUpdateEmployeeSchema
};