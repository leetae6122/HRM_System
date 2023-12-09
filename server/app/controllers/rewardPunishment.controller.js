import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
} from "../utils/message.util.js";
import rewardPunishmentService from "./../services/rewardPunishment.service.js";
import employeeService from "./../services/employee.service.js";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await rewardPunishmentService.foundRewardPunishment(req.params.id, next);
        if (req.user.employeeId !== data.employeeId && !req.user.isAdmin) {
            createError.Unauthorized("You do not have permission to perform this function")
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await rewardPunishmentService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.employeeGetListRewardPunishment = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await rewardPunishmentService.filterListRewardPunishment(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.adminGetListRewardPunishment = async (req, res, next) => {
    try {
        const data = await rewardPunishmentService.filterListRewardPunishment(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createRewardPunishment = async (req, res, next) => {
    try {
        const payload = {
            type: req.body.type,
            reason: req.body.reason,
            amount: req.body.amount,
            date: req.body.date,
            adminEId: req.user.employeeId,
        }
        await Promise.all(req.body.employees.map(async (employeeId) => {
            await employeeService.foundEmployee(employeeId, next);
            await rewardPunishmentService.createRewardPunishment({ ...payload, employeeId });
        }));
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Reward or Punishment") });
    } catch (error) {
        return next(error);
    }
}

exports.updateRewardPunishment = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            adminEId: req.user.employeeId
        };
        await rewardPunishmentService.foundRewardPunishment(payload.rewardPunishmentId, next);

        await rewardPunishmentService.updateRewardPunishment(payload.rewardPunishmentId, payload);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteRewardPunishment = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("RewardPunishmentId")));
        }
        await rewardPunishmentService.foundRewardPunishment(req.params.id, next);

        await rewardPunishmentService.deleteRewardPunishment(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Reward or Punishment"))
        );
    }
}