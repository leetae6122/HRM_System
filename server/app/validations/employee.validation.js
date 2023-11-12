const Joi = require('joi');

const adminCreateEmployeeSchema = Joi.object({
    employeeId: Joi.string().max(10).required(),
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).max(60).required(),
    phoneNumber: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
        .required(),
    gender: Joi.boolean().truthy('male').falsy('female').required(),
    address: Joi.string().required(),
    dateBirth: Joi.date().less('now').required(),
    citizenshipId: Joi.string().max(20).required(),
    dateHired: Joi.date().max('now'),
    avatar: Joi.any().optional(),
    positionId: Joi.number().integer().required(),
    departmentId: Joi.number().integer().required(),
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
    employeeId: Joi.string().max(10).required(),
    firstName: Joi.string().max(30).optional(),
    lastName: Joi.string().max(30).optional(),
    email: Joi.string().email({ minDomainSegments: 2 }).max(60).optional(),
    gender: Joi.boolean().truthy('male').falsy('female').optional(),
    citizenshipId: Joi.string().max(20).optional(),
    dateHired: Joi.date().max('now').optional(),
    dateOff: Joi.date().optional().default(null),
    avatar: Joi.any().optional(),
    positionId: Joi.number().integer().optional(),
    departmentId: Joi.number().integer().optional(),
}).required().min(1);

module.exports = {
    adminCreateEmployeeSchema,
    updateEmployeeSchema,
    adminUpdateEmployeeSchema
};