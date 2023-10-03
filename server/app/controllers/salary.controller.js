import salaryService from "./../services/salary.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await salaryService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest("Salary not found"));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await salaryService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListSalary = async (req, res, next) => {
    try {
        const data = await salaryService.filterListSalary(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createSalary = async (req, res, next) => {
    try {
        const salaryExisted = await salaryService.findByEmployeeId(req.body.employeeId);
        if (salaryExisted) {
            return next(createError.BadRequest("Employee have created salary"));
        }
        let payload = { ...req.body, addedBy: req.user.employeeId }
        if (!req.body.totalSalary || req.body.totalSalary === 0) {
            payload = {
                ...payload,
                totalSalary: payload.basicSalary + payload.allowance
            }
        }

        const data = await salaryService.createSalary(payload);
        return res.send({ message: "Added salary for successful a employee", data });
    } catch (error) {
        return next(error);
    }
}

exports.updateSalary = async (req, res, next) => {
    try {
        const foundSalary = await salaryService.findById(req.body.salaryId);
        if (!foundSalary) {
            return next(createError.BadRequest("Salary not found"));
        }
        let payload = { ...req.body, addedBy: req.user.employeeId }
        if ((req.body.totalSalary === foundSalary.totalSalary) &&
            (req.body.basicSalary !== foundSalary.basicSalary
                || req.body.allowance !== foundSalary.allowance)) {
            payload = {
                ...payload,
                totalSalary: payload.basicSalary + payload.allowance
            }
        }

        await salaryService.updateSalary(req.body.salaryId, payload);
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(error);
    }
}

exports.deleteSalary = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest("SalaryId cannot be empty"));
        }
        await salaryService.deleteSalary(req.params.id);
        return res.send({ message: "Successful deletion" });
    } catch (error) {
        console.log(error);
        return next(
            createError.BadRequest("This salary cannot be deleted")
        );
    }
}