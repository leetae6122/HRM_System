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
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: db.Employee, as: 'adminData',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: db.Shift, as: 'shiftData',
                },
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findAttendanceByDateShiftIdEmployeeId(attendanceDate, shiftId, employeeId) {
        const result = await db.Attendance.findOne({
            where: {
                attendanceDate,
                shiftId,
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
            const order = body.order;
            const shiftFilter = body.shiftFilter || {};

            const result = await db.Attendance.findAll({
                where,
                order,
                include: [
                    {
                        model: db.Shift, as: 'shiftData', ...shiftFilter
                    },
                ],
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
                    attributes: ['id', 'firstName', 'lastName'],
                    ...employeeFilter,
                },
                {
                    model: db.Employee, as: 'adminData',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: db.Shift, as: 'shiftData',
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

    async logoutAttendance(body, foundAttendance, foundShift) {
        let payload = body;

        payload.outStatus = this.checkOutTime(payload.outTime, foundShift);
        payload.totalHours = this.calTotalHours(
            foundAttendance.inTime,
            payload.outTime,
            foundShift
        );
        await this.updateAttendance(foundAttendance.id, payload)
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
        const startDate = dayjs(inTime, "HH:mm:ss") > dayjs(shift.startTime, "HH:mm:ss")
            ? dayjs(inTime, "HH:mm:ss")
            : dayjs(shift.startTime, "HH:mm:ss");
        const endDate = dayjs(outTime) < dayjs(shift.endTime, "HH:mm:ss")
            ? dayjs(outTime)
            : dayjs(shift.endTime, "HH:mm:ss");

        const totalHoursWorked = endDate.diff(startDate, 'hour', true);
        const result = (Math.round(totalHoursWorked * 100) / 100).toFixed(2);
        return result >= 0 ? result : 0;

    }

    checkInTime(inTime, shift) {
        if (inTime > dayjs(shift.startTime, "HH:mm:ss")) {
            return 'Late In';
        }
        if (inTime <= dayjs(shift.startTime, "HH:mm:ss")) {
            return 'On Time';
        }
    }

    checkOutTime(outTime, shift) {
        if (outTime < dayjs(shift.endTime, "HH:mm:ss")) {
            return 'Out Early';
        }
        if (outTime >= dayjs(shift.endTime, "HH:mm:ss")) {
            return 'On Time';
        }
    }

}

module.exports = new AttendanceService;