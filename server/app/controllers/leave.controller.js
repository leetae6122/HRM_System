import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util";
import leaveService from "./../services/leave.service";
import createError from 'http-errors';
import mailService from './../services/mail.service';

exports.findById = async (req, res, next) => {
    try {
        const data = await leaveService.findById(req.params.id);
        if (!data) {
            if (req.user.employeeId === data.employeeId && !req.user.isAdmin) {
                return next(createError.Unauthorized("You do not have permission"));
            }
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Leave")));
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
        if (req.body.status === 'Approve') {
            payload = {
                ...req.body,
                handledBy: employeeId
            }
        }
        const data = await leaveService.createLeave(payload);

        const leaveData = await leaveService.findById(data.id);
        await mailService.sendMailRespondLeaveRequests(leaveData);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Leave"), data });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.updateLeave = async (req, res, next) => {
    try {
        const foundLeave = await leaveService.findById(req.body.leaveId);
        if (!foundLeave) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Leave")));
        }
        if (foundLeave.status !== 'Pending') {
            return next(createError.BadRequest("Leave status is not Pending"));
        }
        const payload = {
            ...req.body,
            handledBy: req.user.employeeId
        }

        await leaveService.updateLeave(req.body.leaveId, payload);

        const leaveData = await leaveService.findById(req.body.leaveId);
        await mailService.sendMailRespondLeaveRequests(leaveData);
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
        if (foundLeave.status !== 'Pending' && !req.user.isAdmin) {
            return next(createError.BadRequest("Leave status is not Pending"));
        }

        await leaveService.deleteLeave(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Leave"))
        );
    }
}