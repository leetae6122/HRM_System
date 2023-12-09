import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util.js";
import departmentService from "./../services/department.service.js";
import employeeService from "./../services/employee.service.js";
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
        if (req.body.managerEId) {
            const foundEmployee = await employeeService.foundEmployee(req.body.managerEId, next, true);
            if (foundEmployee.manageDepartment.id && foundEmployee.manageDepartment.managerEId === foundEmployee.id) {
                return next(createError.BadRequest("This employee is already a manager of another department"));
            }
        }

        const data = await departmentService.createDepartment(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Department"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateDepartment = async (req, res, next) => {
    try {
        const foundDepartment = await departmentService.foundDepartment(req.body.departmentId, next);
        if (foundDepartment.managerEId !== req.body.managerEId && req.body.managerEId) {
            const foundEmployee = await employeeService.foundEmployee(req.body.managerEId, next, true);
            if (foundEmployee.manageDepartment.id && foundEmployee.manageDepartment.managerEId === foundEmployee.id) {
                return next(createError.BadRequest("This employee is already a manager of another department"));
            }
        }

        const payload = {
            ...req.body,
            managerEId: req.body.managerEId === '' ? null : req.body.managerEId
        }

        await departmentService.updateDepartment(req.body.departmentId, payload);
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
        await departmentService.foundDepartment(req.body.id, next);

        await departmentService.deleteDepartment(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Department"))
        );
    }
}

exports.countEmployees = async (req, res, next) => {
    try {
        const data = await departmentService.countEmployees();
        res.send({ data })
    } catch (error) {
        return next(next);
    }
}