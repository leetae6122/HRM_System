import {
    MSG_CREATED_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_EXISTED,
    MSG_ERROR_ID_EMPTY,
    MSG_ERROR_NOT_FOUND,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util";
import officeService from "./../services/office.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await officeService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Office")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await officeService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListOffice = async (req, res, next) => {
    try {
        const data = await officeService.filterListOffice(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createOffice = async (req, res, next) => {
    try {
        const officeExisted = await officeService.findByTitleOffice(req.body.title);
        if (officeExisted) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Title Office")));
        }

        const data = await officeService.createOffice(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Office"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateOffice = async (req, res, next) => {
    try {
        const officeExisted = await officeService.findByTitleOffice(req.body.title);
        if (officeExisted && officeExisted.id !== req.body.officeId) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Title Office")));
        }
        const foundOffice = await officeService.findById(req.body.officeId);
        if (!foundOffice) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Office")));
        }

        await officeService.updateOffice(req.body.officeId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteOffice = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("OfficeId")));
        }
        const foundOffice = await officeService.findById(req.params.id);
        if (!foundOffice) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Office")));
        }

        await officeService.deleteOffice(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Office"))
        );
    }
}