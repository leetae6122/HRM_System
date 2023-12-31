import express from "express";
import leaveController from "./../controllers/leave.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    employeeCreateLeaveSchema,
    adminCreateLeaveSchema,
    adminUpdateLeaveSchema,
    employeeUpdateLeaveSchema
} from "../validations/leave.validation.js";
import {
    filterAll,
    filterSchema,
    modelFilterSchema
} from "../validations/filter.validation.js";
import { verifyAdmin } from './../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/")
    .post(validation(employeeCreateLeaveSchema), leaveController.createLeave)
    .patch(validation(employeeUpdateLeaveSchema), leaveController.employeeUpdateLeave)

router.route("/count")
    .get(verifyAdmin, leaveController.countLeave)

router.route("/filter-all")
    .post(validation(filterAll), leaveController.filterAll)


router.route("/filter")
    .post(validation(filterSchema), leaveController.employeeGetListLeave)

router.route("/admin")
    .all(verifyAdmin)
    .get(leaveController.findAll)
    .post(validation(adminCreateLeaveSchema), leaveController.createLeave)
    .patch(validation(adminUpdateLeaveSchema), leaveController.adminUpdateLeave)

router.route("/admin/filter")
    .post(verifyAdmin, validation(modelFilterSchema), leaveController.adminGetListLeave)

router.route("/:id")
    .get(leaveController.findById)
    .delete(leaveController.deleteLeave)
module.exports = router;