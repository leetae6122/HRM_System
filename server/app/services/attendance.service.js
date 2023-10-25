import db from "./../models/index";
import dayjs from "dayjs";
import createError from 'http-errors';
import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

class AttendanceService {
    async findById(id) {
        const result = await db.Attendance.findByPk(id, {
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: db.Employee, as: 'adminData',
                    attributes: ['firstName', 'lastName', 'email']
                },
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findByAttendanceDateAndEmployeeId(attendanceDate, employeeId) {
        const result = await db.Attendance.findOne({
            where: {
                attendanceDate,
                employeeId
            },
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll(body = null) {
        if (body) {
            const where = body.where;
            const attributes = body.attributes;
            const order = body.order;

            const result = await db.Attendance.findAll({
                where,
                order,
                attributes,
                raw: true,
                nest: true
            })
            return result;
        }
        const result = await db.Attendance.findAll({});
        return result;
    }

    async filterListAttendance(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Attendance.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            raw: true,
            nest: true,
            include: [
                {
                    model: db.Employee, as: 'employeeData',
                    attributes: ['firstName', 'lastName'],
                    ...employeeFilter,
                },
                {
                    model: db.Employee, as: 'adminData',
                    attributes: ['firstName', 'lastName']
                },
            ],
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

    async createAttendance(payload) {
        const result = await db.Attendance.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateAttendance(id, payload) {
        await db.Attendance.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteAttendance(id) {
        await db.Attendance.destroy({
            where: { id }
        });
    }

    async foundAttendance(attendanceId, next) {
        const foundAttendance = await this.findById(attendanceId);
        if (!foundAttendance) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Attendance")));
        }
        return foundAttendance;
    }

    async countAttendance() {
        const now = dayjs();
        const countAttendances = await db.Attendance.count({
            where: {
                attendanceDate: now,
                adminStatus: { $in: ['Approved', 'Pending'] }
            }
        });
        const countPendingAttendances = await db.Attendance.count({
            where: {
                adminStatus: 'Pending'
            }
        });
        return {
            totalAttendances: countAttendances,
            pendingAttendances: countPendingAttendances
        }
    }

    calTotalHours(inTime, outTime, shift) {
        const totalWorkingHours = dayjs(shift.endTime, "HH:mm:ss")
            .diff(dayjs(shift.startTime, "HH:mm:ss"), 'hour');

        let totalHoursWorked = dayjs(outTime, "HH:mm:ss")
            .diff(dayjs(inTime, "HH:mm:ss"), 'hour', true);
        totalHoursWorked = Math.round((totalHoursWorked + Number.EPSILON) * 100) / 100;

        return (totalHoursWorked > totalWorkingHours) ? totalWorkingHours : totalHoursWorked;
    }

    checkInTime(inTime, shift) {
        if (dayjs(inTime, "HH:mm:ss") > dayjs(shift.startTime, "HH:mm:ss")) {
            return 'Late In';
        }
        if (dayjs(inTime, "HH:mm:ss") <= dayjs(shift.startTime, "HH:mm:ss")) {
            return 'On Time';
        }
    }

    checkOutTime(outTime, shift) {
        if (dayjs(outTime, "HH:mm:ss") < dayjs(shift.endTime, "HH:mm:ss")) {
            return 'Out Early';
        }
        if (dayjs(outTime, "HH:mm:ss") >= dayjs(shift.endTime, "HH:mm:ss")) {
            return 'On Time';
        }
    }

}

module.exports = new AttendanceService;