import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
    MSG_PAYROLL_STATUS_NOT_PENDING,
    MSG_ERROR_PAYROLL_EXISTED
} from "../utils/message.util";
import payrollService from "./../services/payroll.service";
import employeeService from "./../services/employee.service";
import createError from 'http-errors';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { getMonthName } from "../utils/handleDate";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat)
dayjs.extend(utc);

exports.findById = async (req, res, next) => {
    try {
        const data = await payrollService.foundPayroll(req.params.id, next);
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
        const data = await payrollService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.employeeGetListPayroll = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await payrollService.filterListPayroll(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.adminGetListPayroll = async (req, res, next) => {
    try {
        const data = await payrollService.filterListPayroll(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createPayroll = async (req, res, next) => {
    try {
        req.body.month = dayjs(req.body.month).startOf('month').toDate();
        const payrollExisted = await payrollService.findByMonthAndEmployeeId(req.body.month, req.body.employeeId);
        if (payrollExisted) {
            return next(createError.BadRequest(MSG_ERROR_PAYROLL_EXISTED(getMonthName(req.body.month))));
        }
        await employeeService.foundEmployee(req.body.employeeId);

        const data = await payrollService.createPayroll(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Payroll"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updatePayroll = async (req, res, next) => {
    try {
        const payload = req.body;
        const foundPayroll = await payrollService.foundPayroll(payload.payrollId, next);
        if (foundPayroll.status === "Paid") {
            return next(createError.BadRequest(MSG_PAYROLL_STATUS_NOT_PENDING));
        }
        if (payload.deduction >= 0 && foundPayroll.deduction !== payload.deduction) {
            payload.totalPaid = (foundPayroll.totalPaid + foundPayroll.deduction) - payload.deduction
        }
        payload.handledBy = req.user.employeeId;

        await payrollService.updatePayroll(payload.payrollId, payload);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deletePayroll = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("PayrollId")));
        }
        const foundPayroll = await payrollService.foundPayroll(req.params.id, next);
        if (foundPayroll.status === "Paid") {
            return next(createError.BadRequest(MSG_PAYROLL_STATUS_NOT_PENDING));
        }

        await payrollService.deletePayroll(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Payroll"))
        );
    }
}