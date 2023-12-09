import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
} from "../utils/message.util.js";
import allowanceService from "./../services/allowance.service.js";
import employeeService from "./../services/employee.service.js";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await allowanceService.foundAllowance(req.params.id, next);
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
        const data = await allowanceService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.employeeGetListAllowance = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await allowanceService.filterListAllowance(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.adminGetListAllowance = async (req, res, next) => {
    try {
        const data = await allowanceService.filterListAllowance(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createAllowance = async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            amount: req.body.amount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            adminEId: req.user.employeeId,
        }
        await Promise.all(req.body.employees.map(async (employeeId) =>{
            await employeeService.foundEmployee(employeeId, next);
            await allowanceService.createAllowance({ ...payload, employeeId });
        }));
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Allowance") });
    } catch (error) {
        return next(error);
    }
}

exports.updateAllowance = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            adminEId: req.user.employeeId
        };
        await allowanceService.foundAllowance(payload.allowanceId, next);

        await allowanceService.updateAllowance(payload.allowanceId, payload);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteAllowance = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("AllowanceId")));
        }
        await allowanceService.foundAllowance(req.params.id, next);

        await allowanceService.deleteAllowance(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Allowance"))
        );
    }
}