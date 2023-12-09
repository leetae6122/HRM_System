import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util.js";
import shiftService from "./../services/shift.service.js";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await shiftService.foundShift(req.params.id, next);

        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await shiftService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListShift = async (req, res, next) => {
    try {
        const data = await shiftService.filterListShift(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createShift = async (req, res, next) => {
    try {
        const data = await shiftService.createShift(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Shift"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateShift = async (req, res, next) => {
    try {
        await shiftService.foundShift(req.body.shiftId, next);

        await shiftService.updateShift(req.body.shiftId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteShift = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("ShiftId")));
        }
        await shiftService.foundShift(req.params.id, next);

        await shiftService.deleteShift(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Shift"))
        );
    }
}

exports.getCurrentShiftList = async (req, res, next) => {
    try {
        const data = await shiftService.getCurrentShiftList();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}