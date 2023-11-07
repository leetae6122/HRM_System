import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';
import attendanceService from "./attendance.service";
import wageService from "./wage.service";
import allowanceService from "./allowance.service";
import dayjs from "dayjs";

class PayrollService {
    async findById(id) {
        const result = await db.Payroll.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Wage, as: 'wageData' },
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
                { model: db.Wage, as: 'wageData' },
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
        let totalBasicWage = 0;
        let totalOvertimeWage = 0;
        let totalAllowance = 0;

        const attendanceList = await attendanceService.findAll({
            where: {
                attendanceDate: { $between: [payload.startDate, payload.endDate] },
                employeeId: payload.employeeId
            }
        });
        attendanceList.forEach((attendance) => {
            if (attendance.shiftData.overtimeShift) {
                hoursOvertime += attendance.totalHours;
                return;
            }
            if (!attendance.shiftData.overtimeShift) {
                hoursWorked += attendance.totalHours;
            }
        });

        const wageList = await wageService.findAllByEmployeeIdWithDate(
            payload.employeeId,
            payload.startDate,
            payload.endDate
        );
        wageList.forEach((wage) => {
            const attendanceListFilter = attendanceList.filter((attendance) => {
                if (wage.toDate) {
                    return dayjs(wage.fromDate) >= dayjs(attendance.attendanceDate)
                        && dayjs(attendance.attendanceDate) <= dayjs(wage.toDate);
                }
                if (!wage.toDate) {
                    return dayjs(wage.fromDate) >= dayjs(attendance.attendanceDate);
                }
            });
            attendanceListFilter.forEach((attendance) =>
                totalBasicWage += wage.basicHourlyWage * attendance.totalHours * attendance.shiftData.wageShift
            );
        })

        const allowanceList = await allowanceService.findAllByEmployeeIdWithDate(
            payload.employeeId,
            payload.startDate,
            payload.endDate
        );
        if (allowanceList.length > 0) {
            allowanceList.forEach((allowance) => {
                totalAllowance += allowance.amount;
            })
        }

        payload.hoursWorked = (Math.round(hoursWorked * 100) / 100).toFixed(2);
        payload.hoursOvertime = (Math.round(hoursOvertime * 100) / 100).toFixed(2);
        payload.totalPaid = totalBasicWage + totalOvertimeWage + totalAllowance - payload.deduction;

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