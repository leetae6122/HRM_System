import express from "express";
import employeeController from "./../controllers/employee.controller";
import { verifyAdmin, verifyAdminOrSelf } from './../middlewares/auth.middleware';
import validation from '../middlewares/validation.middleware';
import {
    adminCreateEmployeeSchema,
    updateEmployeeSchema,
    adminUpdateEmployeeSchema
} from "../validations/employee.validation";

const router = express.Router();

router.route("/")
    .get(employeeController.findProfileById)
    .patch(validation(updateEmployeeSchema), employeeController.updateEmployee)

router.route("/admin")
    .all(verifyAdmin)
    .get(employeeController.findAll)
    .post(validation(adminCreateEmployeeSchema), employeeController.createEmployee)
    .patch(validation(adminUpdateEmployeeSchema), employeeController.updateEmployee)

router.route("/:id")
    .get(verifyAdminOrSelf, employeeController.findProfileById)

module.exports = router;