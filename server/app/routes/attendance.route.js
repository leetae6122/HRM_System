import express from "express";
import attendanceController from "./../controllers/attendance.controller";
import validation from '../middlewares/validation.middleware';
import {
    attendanceByShiftSchema,
    inTimeAttendanceSchema,
    outTimeAttendanceSchema,
    managerUpdateAttendanceSchema,
    adminUpdateAttendanceSchema,
} from "../validations/attendance.validation";
import { filterAll, modelFilterSchema } from "../validations/filter.validation";
import { verifyAdmin, verifyAdminOrDepartmentManager } from './../middlewares/auth.middleware';

const router = express.Router();

router.route("/")

    .post(validation(inTimeAttendanceSchema), attendanceController.logInAttendance)
    .patch(validation(outTimeAttendanceSchema), attendanceController.logOutAttendance)

router.route("/by-shift")
    .post(validation(attendanceByShiftSchema), attendanceController.getAttendanceByShift)

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