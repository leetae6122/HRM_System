import express from "express";
import attendanceController from "./../controllers/attendance.controller";
import validation from '../middlewares/validation.middleware';
import {
    adminUpdateAttendanceSchema,
    employeeUpdateAttendanceSchema,
    createAttendanceSchema
} from "../validations/attendance.validation";
import { filterAll, modelFilterSchema } from "../validations/filter.validation";
import { verifyAdmin } from './../middlewares/auth.middleware';

const router = express.Router();

router.route("/")
    .post(validation(createAttendanceSchema), attendanceController.createAttendance)
    .patch(validation(employeeUpdateAttendanceSchema), attendanceController.employeeUpdateAttendance)

router.route("/count")
    .get(verifyAdmin, attendanceController.countAttendance)

router.route("/filter-all")
    .post(validation(filterAll), attendanceController.filterAll)

router.route("/filter")
    .post(validation(modelFilterSchema), attendanceController.employeeGetListAttendance)

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