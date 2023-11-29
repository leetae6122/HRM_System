import dayjs from "dayjs";
import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_ATTENDANCE_STATUS_NOT_PENDING,
    MSG_ERROR_NOT_HAVE_PERMISSION,
    MSG_TOKEN_DOES_NOT_MATCH
} from "../utils/message.util";
import attendanceService from "./../services/attendance.service";
import employeeService from "./../services/employee.service";
import shiftService from "./../services/shift.service";
import createError from 'http-errors';
import _ from 'lodash';
import { verifyToken } from "../utils/jwt.util";
import config from '../config/configServer';
import qrCodeService from "./../services/qrCode.service"
import { compareHashedData } from "../utils/hash.util";

exports.findById = async (req, res, next) => {
    try {
        const data = await attendanceService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Attendance")));
        }
        if (data.employeeId !== req.user.employeeId
            && !req.user.isAdmin
            && req.user.employeeId !== data.employeeData.departmentData.managerEId) {
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

exports.currentAttendance = async (req, res, next) => {
    try {
        const data = await attendanceService.currentAttendance(req.user.employeeId);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.managerGetListAttendance = async (req, res, next) => {
    try {
        const managerDepartmentId = req.user.profile.manageDepartment.id;
        const listEmployee = await employeeService.getListEmployeeByDepartment(managerDepartmentId);
        const arrEmployeeId = listEmployee.map((employee) => {
            if (employee.id === req.user.employeeId)
                return;
            return employee.id;
        });

        const employeeIdFilter = req.body.where.employeeId
            ? _.filter(_.without(arrEmployeeId, undefined),
                (employeeId) => employeeId === req.body.where.employeeId
            )
            : { $in: _.without(arrEmployeeId, undefined) };

        const payload = {
            ...req.body,
            where: {
                ...req.body.where,
                employeeId: employeeIdFilter
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
        const foundEmployee = await employeeService.checkEmployeeIsWorking(req.body.employeeId, next);
        if (!foundEmployee) {
            return next(
                createError.NotFound("The employee code is incorrect or the employee has left work")
            );
        }
        let payload = verifyToken(req.body.token, config.jwt.qr_code.secret);
        const foundQRCode = await qrCodeService.findById(payload.qrCodeId);
        if (!foundQRCode) {
            return next(createError.NotFound(MSG_ERROR_NOT_FOUND("QRCode")));
        }

        const isMatch = await compareHashedData(
            req.body.token.slice(req.body.token.lastIndexOf('.')),
            foundQRCode.hashQRCodeToken,
        );
        if (!isMatch) {
            return next(createError.BadRequest(MSG_TOKEN_DOES_NOT_MATCH));
        }
        payload = {
            ...payload,
            ...req.body,
        }

        if (!dayjs().isSame(dayjs(payload.attendanceDate), 'day')) {
            return next(createError.BadRequest('Invalid login date'));
        }
        const foundShift = await shiftService.foundShift(payload.shiftId, next);
        const foundAttendance = await attendanceService.findAttendanceByDateEmployeeId(
            payload.attendanceDate,
            payload.employeeId
        );
        if (foundAttendance) {
            return next(createError.BadRequest(
                `Logged in!!! Shift: ${foundAttendance.shiftData.name} (${foundAttendance.shiftData.startTime} - ${foundAttendance.shiftData.endTime})`
            ));
        }

        payload.inStatus = attendanceService.checkInTime(payload.inTime, foundShift);

        await attendanceService.createAttendance(payload);
        await qrCodeService.deleteQRCode(payload.qrCodeId);
        return res.send({ message: "Successful Attendance" });
    } catch (error) {
        return next(error);
    }
}

exports.logOutAttendance = async (req, res, next) => {
    try {
        const foundAttendance = await attendanceService.findById(req.body.attendanceId);
        if (!foundAttendance) {
            return next(createError.BadRequest("You're not logged in to your shift"));
        }
        if (foundAttendance.outTime) {
            return next(createError.BadRequest(
                `Logged out!!! Shift: ${foundAttendance.shiftData.name} (${foundAttendance.shiftData.startTime} - ${foundAttendance.shiftData.endTime})`
            ));
        }

        await attendanceService.logoutAttendance(req.body, foundAttendance);
        return res.send({ message: "Logout successfully" });
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
            adminEId: req.user.employeeId
        }
        if (foundAttendance.employeeData.id === foundAttendance.employeeData.departmentData.managerEId) {
            payload.managerStatus = 'Approved';
            payload.managerEId = foundAttendance.employeeData.id;
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
        if (req.user.profile.manageDepartment.id !== foundAttendance.employeeData.departmentData.id) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }

        const payload = {
            ...req.body,
            managerEId: req.user.employeeId
        }

        await attendanceService.updateAttendance(req.body.attendanceId, payload);

        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteAttendance = async (req, res, next) => {
    try {
        const foundEmployee = await employeeService.foundEmployee(req.user.employeeId, next);
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("AttendanceId")));
        }
        const foundAttendance = await attendanceService.foundAttendance(req.params.id, next);

        if (!foundEmployee.userData.isAdmin) {
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
