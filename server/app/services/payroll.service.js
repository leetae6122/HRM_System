import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';
import attendanceService from "./attendance.service";
import salaryService from "./salary.service";

class PayrollService {
    async findById(id) {
        const result = await db.Payroll.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Salary, as: 'salaryData' },
                { model: db.Employee, as: 'handlerData' }
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByMonthAndEmployeeId(month, employeeId) {
        const result = await db.Payroll.findOne({
            where: {
                month,
                employeeId
            },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Payroll.findAll({});
        return result;
    }

    async filterListPayroll(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Payroll.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                { model: db.Employee, as: 'employeeData', ...employeeFilter },
                { model: db.Salary, as: 'salaryData' },
                { model: db.Employee, as: 'handlerData' }
            ],
            raw: true,
            nest: true
        });


        const nextPage = page + 1 > Math.ceil(count / limit) ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            total: count,
            currentPage: page,
            nextPage,
            prevPage,
            data: rows,
        };
    }

    async createPayroll(body) {
        const payload = body;
        let hoursWorked = 0;
        let hoursOvertime = 0;

        const listAttendances = await attendanceService.findAll({
            where: {
                attendanceDate: { $between: [payload.startDate, payload.endDate] },
                employeeId: payload.employeeId
            }
        });
        listAttendances.forEach((attendance) => {
            if (attendance.shiftData.overtimeShift) {
                hoursOvertime += attendance.totalHours;
                return;
            }
            if (!attendance.shiftData.overtimeShift) {
                hoursWorked += attendance.totalHours;
            }
        });

        const employeeSalary = await salaryService.findByEmployeeId(payload.employeeId);
        payload.salaryId = employeeSalary.id;
        payload.hoursWorked = (Math.round(hoursWorked * 100) / 100).toFixed(2);
        payload.hoursOvertime = (Math.round(hoursOvertime * 100) / 100).toFixed(2);
        payload.totalPaid = (hoursWorked * employeeSalary.basicHourlySalary)
            + (hoursOvertime * employeeSalary.hourlyOvertimeSalary)
            + employeeSalary.allowance
            - payload.deduction;

        const result = await db.Payroll.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updatePayroll(id, payload) {
        await db.Payroll.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deletePayroll(id) {
        await db.Payroll.destroy({
            where: { id }
        });
    }

    async foundPayroll(payrollId, next) {
        const foundPayroll = await this.findById(payrollId);
        if (!foundPayroll) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Payroll")));
        }
        return foundPayroll;
    }
}

module.exports = new PayrollService;