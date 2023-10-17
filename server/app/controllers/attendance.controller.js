import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
    MSG_ATTENDANCE_STATUS_NOT_PENDING,
    MSG_PROJECT_STATUS_NOT_RUNNING,
    MSG_ERROR_NOT_HAVE_PERMISSION
} from "../utils/message.util";
import attendanceService from "./../services/attendance.service";
import projectService from "./../services/project.service";
import taskService from "./../services/task.service";
import createError from 'http-errors';

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

exports.createAttendance = async (req, res, next) => {
    try {
        const { employeeId } = req.user;
        const foundProject = await projectService.foundProject(req.body.projectId, next);
        if (foundProject.status !== "Running") {
            return next(createError.BadRequest(MSG_PROJECT_STATUS_NOT_RUNNING));
        }
        await taskService.foundTask(req.body.taskId, next);

        const payload = {
            ...req.body,
            employeeId
        }
        const data = await attendanceService.createAttendance(payload);

        return res.send({ message: MSG_CREATED_SUCCESSFUL("Attendance"), data });
    } catch (error) {
        return next(error);
    }
}

exports.adminUpdateAttendance = async (req, res, next) => {
    try {
        const foundAttendance = await attendanceService.findById(req.body.attendanceId);
        if (!foundAttendance) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Attendance")));
        }
        if (foundAttendance.status !== 'Pending') {
            return next(createError.BadRequest(MSG_ATTENDANCE_STATUS_NOT_PENDING));
        }

        const payload = {
            ...req.body,
            handledBy: req.user.employeeId
        }

        await attendanceService.updateAttendance(req.body.attendanceId, payload);

        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.employeeUpdateAttendance = async (req, res, next) => {
    try {
        const foundAttendance = await attendanceService.findById(req.body.attendanceId);
        if (!foundAttendance) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Attendance")));
        }
        if (foundAttendance.employeeId !== req.user.employeeId) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }
        if (foundAttendance.status !== 'Pending') {
            return next(createError.BadRequest(MSG_ATTENDANCE_STATUS_NOT_PENDING));
        }

        if (req.body.projectId !== foundAttendance.projectId) {
            const foundProject = await projectService.foundProject(req.body.projectId, next)
            if (foundProject.status !== "Running") {
                return next(createError.BadRequest(MSG_PROJECT_STATUS_NOT_RUNNING));
            }
        }
        if (req.body.taskId !== foundAttendance.taskId) {
            await taskService.foundTask(req.body.taskId, next);
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
        const foundAttendance = await attendanceService.findById(req.params.id);
        if (!foundAttendance) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Attendance")));
        }
        if (foundAttendance.employeeId !== req.user.employeeId) {
            return next(createError.Unauthorized(MSG_ERROR_NOT_HAVE_PERMISSION));
        }
        if (foundAttendance.status !== 'Pending' && !req.user.isAdmin) {
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