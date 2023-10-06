import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util";
import departmentService from "./../services/department.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await departmentService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Department")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await departmentService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListDepartment = async (req, res, next) => {
    try {
        const data = await departmentService.filterListDepartment(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createDepartment = async (req, res, next) => {
    try {
        const data = await departmentService.createDepartment(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Department"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateDepartment = async (req, res, next) => {
    try {
        const foundDepartment = await departmentService.findById(req.body.departmentId);
        if (!foundDepartment) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Department")));
        }

        await departmentService.updateDepartment(req.body.departmentId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteDepartment = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("DepartmentId")));
        }
        const foundDepartment = await departmentService.findById(req.params.id);
        if (!foundDepartment) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Department")));
        }

        await departmentService.deleteDepartment(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Department"))
        );
    }
}