import express from "express";
import payrollController from "./../controllers/payroll.controller";
import validation from '../middlewares/validation.middleware';
import {
    createPayrollSchema,
    updatePayrollSchema
} from "../validations/payroll.validation";
import { modelFilterSchema } from "../validations/filter.validation";
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route("/")
    .all(verifyAdmin)
    .get(payrollController.findAll)
    .post(validation(createPayrollSchema), payrollController.createPayroll)
    .patch(validation(updatePayrollSchema), payrollController.updatePayroll)

router.route("/filter")
    .post(validation(modelFilterSchema), payrollController.employeeGetListPayroll)

router.route("/admin/filter")
    .post(verifyAdmin, validation(modelFilterSchema), payrollController.adminGetListPayroll)

router.route("/:id")
    .get(payrollController.findById)
    .delete(verifyAdmin, payrollController.deletePayroll)
module.exports = router;