const Joi = require('joi');

const createBankAccountSchema = Joi.object({
    accountName: Joi.string().max(60).required(),
    bankName: Joi.string().max(100).required(),
    accountNum: Joi.string().max(20).pattern(/^[0-9]+$/).required(),
    employeeId: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

const updateBankAccountSchema = Joi.object({
    bankAccountId: Joi.number().integer().required(),
    accountName: Joi.string().max(60).optional(),
    bankName: Joi.string().max(100).optional(),
    accountNum: Joi.string().max(20).pattern(/^[0-9]+$/).optional(),
}).required().min(1);

module.exports = { createBankAccountSchema, updateBankAccountSchema };