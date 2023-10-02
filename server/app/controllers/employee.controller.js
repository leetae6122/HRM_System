import employeeService from "./../services/employee.service";
import createError from 'http-errors';
import cloudinary from 'cloudinary';

exports.findProfileById = async (req, res, next) => {
    try {
        const employeeId = req.params.id ? req.params.id : req.user.employeeId;
        if (!employeeId) {
            return next(
                createError.BadRequest("EmployeeId cannot be empty")
            );
        }

        const data = await employeeService.findById(employeeId);
        if (!data) {
            return next(
                createError.NotFound("Employee not found")
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
        let payload = {
            ...req.body,
            addedBy: req.user.employeeId
        }
        const fileData = req.file;
        if (fileData) {
            payload = {
                ...payload,
                avatarUrl: fileData.path,
            }
        }
        const data = await employeeService.createEmployee(payload);
        return res.send({ message: "Successfully added employee", data });
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
                createError.NotFound("Employee not found")
            );
        }
        if (employee.email !== req.body.email) {
            await employeeService.checkEmailExisted(req.body.email, next);
        }
        if (employee.phoneNumber !== req.body.phoneNumber) {
            await employeeService.checkPhoneNumberExisted(req.body.phoneNumber, next);
        }

        let payload = {
            ...req.body,
            addedBy: req.user.employeeId
        }

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
        return res.send({ message: "Successfully update employee profiles" });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.deleteEmployee = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest("EmployeeId cannot be empty"));
        }
        await employeeService.deleteEmployee(req.params.id);
        return res.send({ message: "Successful deletion" });
    } catch (error) {
        return next(
            createError.BadRequest("Deletion cannot be performed with this employee")
        );
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const employee = await employeeService.findById(req.user.employeeId);
        if (!employee) {
            return next(
                createError.NotFound("Employee not found")
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
                createError.NotFound("Employee not found")
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