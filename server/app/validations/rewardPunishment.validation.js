const Joi = require('joi');

const createRewardPunishmentSchema = Joi.object({
    type: Joi.string().valid('Reward', 'Punishment').required(),
    reason: Joi.string().max(200).required(),
    amount: Joi.number().min(0).required(),
    date: Joi.date().required(),
    employees: Joi.array().items(Joi.string()).required(),
});

const updateRewardPunishmentSchema = Joi.object({
    rewardPunishmentId: Joi.number().integer().required(),
    type: Joi.string().valid('Reward', 'Punishment').optional(),
    reason: Joi.string().max(200).optional(),
    amount: Joi.number().optional(),
    date: Joi.date().optional(),
}).required().min(1);

module.exports = { createRewardPunishmentSchema, updateRewardPunishmentSchema };