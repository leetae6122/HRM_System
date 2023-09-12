import employeeService from "./../services/employee.service";
import createError from 'http-errors';

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

exports.createEmployee = async (req, res, next) => {
    try {
        const {email} = req.body;
        const foundEmail = await employeeService.findByEmail(email);
        if(foundEmail){
            return next(
                createError.BadRequest("Email already exists")
            );
        }

        const data = await employeeService.createEmployee(req.body);
        return res.send({ data });
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
        if(req.body.employeeId) delete req.body.employeeId;

        await employeeService.updateEmployee(employeeId, req.body);
        return res.send({ message: "Successfully update employee profiles" });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while retrieving the employees")
        );
    }
}