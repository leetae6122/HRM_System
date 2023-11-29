import {
    MSG_CREATED_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_EXISTED,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util";
import positionService from "./../services/position.service";
import departmentService from "./../services/department.service";
import createError from 'http-errors';

exports.countEmployees = async (req, res, next) => {
    try {
        const data = await positionService.countEmployees();
        res.send({ data })
    } catch (error) {
        return next(next);
    }
}

exports.findById = async (req, res, next) => {
    try {
        const data = await positionService.foundPosition(req.params.id, next);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await positionService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAllWithDepartmentId = async (req, res, next) => {
    try {
        const data = await positionService.findAll({ where: { departmentId: req.params.id } });
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListPosition = async (req, res, next) => {
    try {
        const data = await positionService.filterListPosition(req.body);

        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createPosition = async (req, res, next) => {
    try {
        await departmentService.foundDepartment(req.body.departmentId, next);
        const positionExisted = await positionService.findByPositionName(req.body.name);
        if (positionExisted) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Position name")));
        }

        const data = await positionService.createPosition(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Position"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updatePosition = async (req, res, next) => {
    try {
        const positionExisted = await positionService.findByPositionName(req.body.name);
        if (positionExisted && positionExisted.id !== req.body.positionId) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Position name")));
        }
        if (positionExisted.departmentId !== req.body.departmentId) {
            await departmentService.foundDepartment(req.body.departmentId, next);
        }
        await positionService.foundPosition(req.body.positionId, next);

        await positionService.updatePosition(req.body.positionId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deletePosition = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("PositionId")));
        }
        await positionService.foundPosition(req.params.id, next);

        await positionService.deletePosition(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Position"))
        );
    }
}