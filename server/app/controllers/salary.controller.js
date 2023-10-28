import {
    MSG_ADDED_SALARY_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_EMPLOYEE_CREATED_SALARY,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_ERROR_NOT_FOUND,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util";
import salaryService from "./../services/salary.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await salaryService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Salary")));
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
            return next(createError.BadRequest(MSG_EMPLOYEE_CREATED_SALARY));
        }
        let payload = { ...req.body, addedBy: req.user.employeeId }

        const data = await salaryService.createSalary(payload);
        return res.send({ message: MSG_ADDED_SALARY_SUCCESSFUL, data });
    } catch (error) {
        return next(error);
    }
}

exports.updateSalary = async (req, res, next) => {
    try {
        const foundSalary = await salaryService.findById(req.body.salaryId);
        if (!foundSalary) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Salary")));
        }
        let payload = { ...req.body, addedBy: req.user.employeeId }

        await salaryService.updateSalary(req.body.salaryId, payload);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteSalary = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("SalaryId")));
        }
        const foundSalary = await salaryService.findById(req.params.id);
        if (!foundSalary) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Salary")));
        }

        await salaryService.deleteSalary(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Salary"))
        );
    }
}