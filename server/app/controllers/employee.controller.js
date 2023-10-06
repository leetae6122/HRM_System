import employeeService from "./../services/employee.service";
import createError from 'http-errors';
import cloudinary from 'cloudinary';
import {
    MSG_CREATED_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_ERROR_NOT_FOUND,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util";

exports.findProfileById = async (req, res, next) => {
    try {
        const employeeId = req.params.id ? req.params.id : req.user.employeeId;
        if (!employeeId) {
            return next(
                createError.BadRequest(MSG_ERROR_ID_EMPTY("EmployeeId"))
            );
        }

        const data = await employeeService.findById(employeeId);
        if (!data) {
            return next(
                createError.NotFound(MSG_ERROR_NOT_FOUND("Employee"))
            );
        }
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

exports.getEmployeeNotHaveSalary = async (req, res, next) => {
    try {
        const data = await employeeService.getEmployeeNotHaveSalary();
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
        await employeeService.checkEmailExisted(req.body.email, next);
        await employeeService.checkPhoneNumberExisted(req.body.phoneNumber, next);
        let payload = req.body
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
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.findById(req.body.employeeId);
        if (!employee) {
            return next(
                createError.NotFound(MSG_ERROR_NOT_FOUND("Employee"))
            );
        }
        if (employee.email !== req.body.email) {
            await employeeService.checkEmailExisted(req.body.email, next);
        }
        if (employee.phoneNumber !== req.body.phoneNumber) {
            await employeeService.checkPhoneNumberExisted(req.body.phoneNumber, next);
        }

        let payload = req.body
        const fileData = req.file;
        if (fileData) {
            payload = {
                ...payload,
                avatarUrl: fileData.path,
            }
            if (employee.avatarUrl) {
                cloudinary.uploader.destroy(employeeService.getFileName(employee.avatarUrl));
            }
        }

        await employeeService.updateEmployee(req.body.employeeId, payload);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
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
        const foundEmployee = await employeeService.findById(req.params.id);
        if (!foundEmployee) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Employee")));
        }

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
        const employee = await employeeService.findById(req.user.employeeId);
        if (!employee) {
            return next(
                createError.NotFound(MSG_ERROR_NOT_FOUND("Employee"))
            );
        }

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
        const employee = await employeeService.findById(req.user.employeeId);
        if (!employee) {
            return next(
                createError.NotFound(MSG_ERROR_NOT_FOUND("Employee"))
            );
        }
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