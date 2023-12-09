import express from "express";
import employeeController from "./../controllers/employee.controller.js";
import { verifyAdmin, verifyAdminOrSelf } from './../middlewares/auth.middleware.js';
import validation from '../middlewares/validation.middleware.js';
import {
    adminCreateEmployeeSchema,
    updateEmployeeSchema,
    adminUpdateEmployeeSchema
} from "../validations/employee.validation.js";
import { filterSchema } from '../validations/filter.validation.js';
import uploadCloud from "../middlewares/uploader.middleware.js";

const router = express.Router();

router.route("/")
    .get(employeeController.findProfileById)
    .patch(validation(updateEmployeeSchema), employeeController.updateProfile)

router.route("/count")
    .get(verifyAdmin, employeeController.countEmployee)

router.route("/avatar")
    .put(verifyAdminOrSelf, uploadCloud.single('avatar'), employeeController.updateAvatar)

router.route("/admin")
    .all(verifyAdmin)
    .get(employeeController.findAll)
    .post(uploadCloud.single('avatar'), validation(adminCreateEmployeeSchema), employeeController.createEmployee)
    .patch(uploadCloud.single('avatar'), validation(adminUpdateEmployeeSchema), employeeController.updateEmployee)

router.route("/admin/filter")
    .post(verifyAdmin, validation(filterSchema), employeeController.getListEmployee)

router.route("/admin/not-have-user")
    .get(verifyAdmin, employeeController.getEmployeeNotHaveUser)


router.route("/:id")
    .get(verifyAdminOrSelf, employeeController.findProfileById)
    .delete(verifyAdmin, employeeController.deleteEmployee)
module.exports = router;