import express from "express";
import attendanceController from "./../controllers/attendance.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    loginAttendanceSchema,
    logoutAttendanceSchema,
    managerUpdateAttendanceSchema,
    adminUpdateAttendanceSchema,
} from "../validations/attendance.validation.js";
import { filterAll, modelFilterSchema } from "../validations/filter.validation.js";
import {
    verifyAdmin,
    verifyAdminOrDepartmentManager,
    allowIPMiddleware
} from './../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/")
    .post(validation(loginAttendanceSchema), allowIPMiddleware, attendanceController.logInAttendance)
    .patch(validation(logoutAttendanceSchema), attendanceController.logOutAttendance)

router.route("/current")
    .get(attendanceController.currentAttendance)

router.route("/count")
    .get(verifyAdmin, attendanceController.countAttendance)

router.route("/filter-all")
    .post(validation(filterAll), attendanceController.filterAll)

router.route("/filter")
    .post(validation(modelFilterSchema), attendanceController.employeeGetListAttendance)

router.route("/manager")
    .patch(verifyAdminOrDepartmentManager, validation(managerUpdateAttendanceSchema), attendanceController.managerUpdateAttendance)
router.route("/manager/filter")
    .post(verifyAdminOrDepartmentManager, validation(modelFilterSchema), attendanceController.managerGetListAttendance)

router.route("/admin")
    .all(verifyAdmin)
    .get(attendanceController.findAll)
    .patch(validation(adminUpdateAttendanceSchema), attendanceController.adminUpdateAttendance)

router.route("/admin/filter")
    .post(verifyAdmin, validation(modelFilterSchema), attendanceController.adminGetListAttendance)

router.route("/:id")
    .get(attendanceController.findById)
    .delete(attendanceController.deleteAttendance)
module.exports = router;