import {
    MSG_ADDED_WAGE_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_ERROR_NOT_FOUND,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util.js";
import wageService from "../services/wage.service.js";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await wageService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Wage")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await wageService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListWage = async (req, res, next) => {
    try {
        const data = await wageService.filterListWage(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createWage = async (req, res, next) => {
    try {
        const wageExisted = await wageService.findByEmployeeId(req.body.employeeId);
        if (wageExisted) {
            await wageService.updateWage(wageExisted.id, { toDate: req.body.fromDate });
        }
        let payload = { ...req.body, adminEId: req.user.employeeId }

        const data = await wageService.createWage(payload);
        return res.send({ message: MSG_ADDED_WAGE_SUCCESSFUL, data });
    } catch (error) {
        return next(error);
    }
}

exports.updateWage = async (req, res, next) => {
    try {
        const foundWage = await wageService.findById(req.body.wageId);
        if (!foundWage) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Wage")));
        }
        let payload = { ...req.body, adminEId: req.user.employeeId }

        await wageService.updateWage(req.body.wageId, payload);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteWage = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("WageId")));
        }
        const foundWage = await wageService.findById(req.params.id);
        if (!foundWage) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Wage")));
        }

        await wageService.deleteWage(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Wage"))
        );
    }
}