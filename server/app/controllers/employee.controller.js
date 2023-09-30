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
        const { email } = req.body;
        const foundEmail = await employeeService.findByEmail(email);
        if (foundEmail) {
            return next(
                createError.BadRequest("Email already exists")
            );
        }

        const data = await employeeService.createEmployee(req.body);
        return res.send({message: "Successfully added employee", data });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}

exports.updateEmployee = async (req, res, next) => {
    try {
        const employeeId = req.body.employeeId
            ? req.body.employeeId
            : req.user.employeeId;
        if (req.body.employeeId) delete req.body.employeeId;

        await employeeService.updateEmployee(employeeId, req.body);
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