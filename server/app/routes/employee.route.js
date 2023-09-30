import express from "express";
import employeeController from "./../controllers/employee.controller";
import { verifyAdmin, verifyAdminOrSelf } from './../middlewares/auth.middleware';
import validation from '../middlewares/validation.middleware';
import {
    adminCreateEmployeeSchema,
    updateEmployeeSchema,
    adminUpdateEmployeeSchema
} from "../validations/employee.validation";
import { filterSchema } from '../validations/filter.validation';
import uploadCloud from "../middlewares/uploader.middleware";

const router = express.Router();

router.route("/")
    .get(employeeController.findProfileById)
    .patch(validation(updateEmployeeSchema), employeeController.updateEmployee)

router.route("/avatar")
    .put(verifyAdminOrSelf, uploadCloud.single('user-avatar'), employeeController.updateAvatar)

router.route("/admin")
    .all(verifyAdmin)
    .get(employeeController.findAll)
    .post(validation(adminCreateEmployeeSchema), employeeController.createEmployee)
    .patch(validation(adminUpdateEmployeeSchema), employeeController.updateEmployee)

router.route("/admin/filter")
    .post(verifyAdmin, validation(filterSchema), employeeController.getListEmployee)

router.route("/:id")
    .get(verifyAdminOrSelf, employeeController.findProfileById)
    .delete(verifyAdmin, employeeController.deleteEmployee)
module.exports = router;