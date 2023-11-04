import dayjs from "dayjs";
import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
    MSG_ATTENDANCE_STATUS_NOT_PENDING,
    MSG_ERROR_NOT_HAVE_PERMISSION
} from "../utils/message.util";
import attendanceService from "./../services/attendance.service";
import employeeService from "./../services/employee.service";
import shiftService from "./../services/shift.service";
import createError from 'http-errors';
import _ from 'lodash';

exports.findById = async (req, res, next) => {
    try {
        const data = await attendanceService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Attendance")));
        }
        if (req.user.employeeId !== data.employeeId && !req.user.isAdmin) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }

        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}


exports.findAll = async (req, res, next) => {
    try {
        const data = await attendanceService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.filterAll = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await attendanceService.findAll(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.managerGetListAttendance = async (req, res, next) => {
    try {
        const listEmployee = await employeeService.getListEmployeeByDepartment(req.manageDepartmentId);
        const arrEmployeeId = listEmployee.map((employee) => {
            if (employee.id === req.user.employeeId)
                return;
            return employee.id;
        });

        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: { $in: _.without(arrEmployeeId, undefined) }
            }
        }

        const data = await attendanceService.filterListAttendance(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.adminGetListAttendance = async (req, res, next) => {
    try {
        const data = await attendanceService.filterListAttendance(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.employeeGetListAttendance = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: req.user.employeeId
            }
        }
        const data = await attendanceService.filterListAttendance(payload);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.logInAttendance = async (req, res, next) => {
    try {
        if (!dayjs().isSame(dayjs(req.body.attendanceDate), 'day')) {
            return next(createError.BadRequest('Invalid login date'));
        }
        let payload = {
            ...req.body,
            employeeId: req.user.employeeId
        }
        const foundShift = await shiftService.foundShift(payload.shiftId, next);
        const foundAttendance = await attendanceService.findAttendanceByDateShiftIdEmployeeId(
            payload.attendanceDate,
            payload.shiftId,
            payload.employeeId
        );
        if (foundAttendance) {
            return next(createError.BadRequest(`Logged in!!! Shift: ${foundShift.name} (${foundShift.startTime} - ${foundShift.endTime})`));
        }

        payload.inStatus = attendanceService.checkInTime(payload.inTime, foundShift);

        const data = await attendanceService.createAttendance(payload);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Attendance"), data });
    } catch (error) {
        return next(error);
    }
}

exports.logOutAttendance = async (req, res, next) => {
    try {
        const foundAttendance = await attendanceService.findAttendanceByDateShiftIdEmployeeId(
            req.body.attendanceDate,
            req.body.shiftId,
            req.user.employeeId
        );
        if (!foundAttendance) {
            return next(createError.BadRequest("You're not logged in to your shift"));
        }
        const foundShift = await shiftService.foundShift(req.body.shiftId, next);
        if (foundAttendance.outTime) {
            return next(createError.BadRequest(`Logged out!!! Shift: ${foundShift.name} (${foundShift.startTime} - ${foundShift.endTime})`));
        }

        await attendanceService.logoutAttendance(req.body, foundAttendance, foundShift);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.adminUpdateAttendance = async (req, res, next) => {
    try {
        const foundAttendance = await attendanceService.foundAttendance(req.body.attendanceId, next);

        if (foundAttendance.adminStatus !== 'Pending') {
            return next(createError.BadRequest(MSG_ATTENDANCE_STATUS_NOT_PENDING));
        }

        const payload = {
            ...req.body,
            adminId: req.user.employeeId
        }

        await attendanceService.updateAttendance(req.body.attendanceId, payload);

        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.managerUpdateAttendance = async (req, res, next) => {
    try {
        const foundAttendance = await attendanceService.foundAttendance(req.body.attendanceId, next);

        if (foundAttendance.managerStatus !== 'Pending') {
            return next(createError.BadRequest(MSG_ATTENDANCE_STATUS_NOT_PENDING));
        }

        await attendanceService.updateAttendance(req.body.attendanceId, req.body);

        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteAttendance = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("AttendanceId")));
        }
        const foundAttendance = await attendanceService.foundAttendance(req.params.id, next);

        if (foundAttendance.employeeId !== req.user.employeeId) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }
        if ((foundAttendance.managerStatus !== 'Pending' && foundAttendance.adminStatus !== 'Pending')
            && !req.user.isAdmin) {
            return next(createError.BadRequest(MSG_ATTENDANCE_STATUS_NOT_PENDING));
        }

        await attendanceService.deleteAttendance(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Attendance"))
        );
    }
}

exports.countAttendance = async (req, res, next) => {
    try {
        const data = await attendanceService.countAttendance();
        return res.send({ data })
    } catch (error) {
        return next(error);
    }
}

exports.getAttendanceByShift = async (req, res, next) => {
    try {
        const data = await attendanceService.findAttendanceByDateShiftIdEmployeeId(
            req.body.attendanceDate,
            req.body.shiftId,
            req.user.employeeId
        );
        return res.send({ data })
    } catch (error) {
        return next(error);
    }
}