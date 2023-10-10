import express from "express";
import leaveController from "./../controllers/leave.controller";
import validation from '../middlewares/validation.middleware';
import {
    employeeCreateLeaveSchema,
    adminCreateLeaveSchema,
    adminUpdateLeaveSchema
} from "../validations/leave.validation";
import { filterSchema } from "../validations/filter.validation";
import { verifyAdmin } from './../middlewares/auth.middleware';

const router = express.Router();

router.route("/")
    .post(validation(employeeCreateLeaveSchema), leaveController.createLeave)

router.route("/filter")
    .post(validation(filterSchema), leaveController.employeeGetListLeave)

router.route("/admin")
    .all(verifyAdmin)
    .get(leaveController.findAll)
    .post(validation(adminCreateLeaveSchema), leaveController.createLeave)
    .patch(validation(adminUpdateLeaveSchema), leaveController.updateLeave)

router.route("admin/filter")
    .post(verifyAdmin, validation(filterSchema), leaveController.adminGetListLeave)

router.route("/:id")
    .get(leaveController.findById)
    .delete(leaveController.deleteLeave)
module.exports = router;