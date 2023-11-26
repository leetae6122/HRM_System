import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
    MSG_LEAVE_STATUS_NOT_PENDING,
    MSG_ERROR_NOT_HAVE_PERMISSION
} from "../utils/message.util";
import leaveService from "./../services/leave.service";
import createError from 'http-errors';
import mailService from './../services/mail.service';
import employeeService from "./../services/employee.service";

exports.findById = async (req, res, next) => {
    try {
        const data = await leaveService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Leave")));
        }
        if (req.user.employeeId !== data.employeeId && !req.user.isAdmin) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }

        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await leaveService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.filterAll = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await leaveService.findAll(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.adminGetListLeave = async (req, res, next) => {
    try {
        const data = await leaveService.filterListLeave(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.employeeGetListLeave = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await leaveService.filterListLeave(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createLeave = async (req, res, next) => {
    try {
        const { employeeId } = req.user;
        let payload;
        if (req.body.status === 'Pending') {
            payload = {
                ...req.body,
                employeeId
            }
        }
        if (req.body.status === 'Approved') {
            await employeeService.foundEmployee(req.body.employeeId, next);
            payload = {
                ...req.body,
                adminEId: employeeId
            }
        }

        const data = await leaveService.createLeave(payload);

        if (data.status === 'Approved') {
            const leaveData = await leaveService.findById(data.null);
            await mailService.sendMailRespondLeaveRequests(leaveData);
        }
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Leave"), data });
    } catch (error) {
        return next(error);
    }
}

exports.adminUpdateLeave = async (req, res, next) => {
    try {
        const foundLeave = await leaveService.findById(req.body.leaveId);
        if (!foundLeave) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Leave")));
        }
        if (foundLeave.status !== 'Pending') {
            return next(createError.BadRequest(MSG_LEAVE_STATUS_NOT_PENDING));
        }
        const payload = {
            ...req.body,
            adminEId: req.user.employeeId
        }

        await leaveService.updateLeave(req.body.leaveId, payload);

        const leaveData = await leaveService.findById(req.body.leaveId);
        await mailService.sendMailRespondLeaveRequests(leaveData);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.employeeUpdateLeave = async (req, res, next) => {
    try {
        const foundLeave = await leaveService.findById(req.body.leaveId);
        if (!foundLeave) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Leave")));
        }
        if (foundLeave.employeeId !== req.user.employeeId) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }
        if (foundLeave.status !== 'Pending') {
            return next(createError.BadRequest(MSG_LEAVE_STATUS_NOT_PENDING));
        }

        await leaveService.updateLeave(req.body.leaveId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteLeave = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("LeaveId")));
        }
        const foundLeave = await leaveService.findById(req.params.id);
        if (!foundLeave) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Leave")));
        }
        if (foundLeave.employeeId !== req.user.employeeId) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }
        if (foundLeave.status !== 'Pending' && !req.user.isAdmin) {
            return next(createError.BadRequest(MSG_LEAVE_STATUS_NOT_PENDING));
        }

        await leaveService.deleteLeave(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Leave"))
        );
    }
}

exports.countLeave = async (req, res, next) => {
    try {
        const data = await leaveService.countLeave();
        return res.send({ data })
    } catch (error) {
        return next(error);
    }
}