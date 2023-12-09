import employeeService from "./../services/employee.service.js";
import userService from "./../services/user.service.js";
import wageService from "./../services/wage.service.js";
import departmentService from "./../services/department.service.js";
import positionService from "./../services/position.service.js";
import createError from 'http-errors';
import cloudinary from 'cloudinary';
import {
    MSG_CREATED_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_EXISTED,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util.js";
import dayjs from "dayjs";


exports.findProfileById = async (req, res, next) => {
    try {
        const employeeId = req.params.id ? req.params.id : req.user.employeeId;
        if (!employeeId) {
            return next(
                createError.BadRequest(MSG_ERROR_ID_EMPTY("EmployeeId"))
            );
        }
        const data = await employeeService.foundEmployee(employeeId, next);
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await employeeService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.getEmployeeNotHaveUser = async (req, res, next) => {
    try {
        const data = await employeeService.getEmployeeNotHaveUser();
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.getListEmployee = async (req, res, next) => {
    try {
        const data = await employeeService.filterListEmployee(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.findById(req.body.employeeId);
        if (employee) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Employee Id")));
        }

        await departmentService.foundDepartment(req.body.departmentId, next);
        await positionService.foundPosition(req.body.positionId, next);
        await employeeService.checkEmailExisted(req.body.email, next);
        await employeeService.checkPhoneNumberExisted(req.body.phoneNumber, next);

        let payload = { ...req.body, id: req.body.employeeId };
        const fileData = req.file;
        if (fileData) {
            payload = {
                ...payload,
                avatarUrl: fileData.path,
            }
        }

        const data = await employeeService.createEmployee(payload);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Employee"), data });
    } catch (error) {
        if (req.file) {
            cloudinary.uploader.destroy(req.file.filename);
        }
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.updateEmployee = async (req, res, next) => {
    try {
        const foundEmployee = await employeeService.foundEmployee(req.body.employeeId, next)

        if (req.body.email && foundEmployee.email !== req.body.email) {
            await employeeService.checkEmailExisted(req.body.email, next);
        }

        if (req.body.phoneNumber && foundEmployee.phoneNumber !== req.body.phoneNumber) {
            await employeeService.checkPhoneNumberExisted(req.body.phoneNumber, next);
        }
        if (foundEmployee.departmentId !== req.body.departmentId) {
            await departmentService.foundDepartment(req.body.departmentId, next);
        }

        if (foundEmployee.positionId !== req.body.positionId) {
            await positionService.foundPosition(req.body.positionId, next);
        }

        let payload = req.body;
        const fileData = req.file;
        if (fileData) {
            payload = {
                ...payload,
                avatarUrl: fileData.path,
            }
            if (foundEmployee.avatarUrl) {
                cloudinary.uploader.destroy(employeeService.getFileName(foundEmployee.avatarUrl));
            }
        }

        await employeeService.updateEmployee(req.body.employeeId, payload);
        if (payload.dateOff) {
            await userService.deactivateUserByEmployeeId(req.body.employeeId);
            await wageService.updateWageWithEmployeeIdAndToDateNull(req.body.employeeId, { toDate: dayjs() });
            if (foundEmployee.manageDepartment.id) {
                await departmentService.updateDepartment(foundEmployee.manageDepartment.id, { managerId: null })
            }
        }
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        if (req.file) {
            cloudinary.uploader.destroy(req.file.filename);
        }
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.deleteEmployee = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("employeeId")));
        }
        await employeeService.foundEmployee(req.params.id, next);

        await employeeService.deleteEmployee(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Employee"))
        );
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        await employeeService.foundEmployee(req.user.employeeId, next);

        await employeeService.updateEmployee(req.user.employeeId, req.body);
        return res.send({ message: "Successfully update employee profiles" });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.updateAvatar = async (req, res, next) => {
    try {
        const employee = await employeeService.foundEmployee(req.user.employeeId, next);

        const fileData = req.file;
        if (!fileData) {
            return next(createError.BadRequest("File does not exist"));
        }
        if (employee.avatarUrl) {
            cloudinary.uploader.destroy(employeeService.getFileName(employee.avatarUrl));
        }
        await employeeService.updateEmployee(employee.id, {
            avatarUrl: fileData.path
        });
        return res.send({ data: fileData.path });
    } catch (error) {
        cloudinary.uploader.destroy(req.file.filename);
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.countEmployee = async (req, res, next) => {
    try {
        const data = await employeeService.countEmployee();
        return res.send({ data })
    } catch (error) {
        return next(
            createError.InternalServerError(error)
        );
    }
}