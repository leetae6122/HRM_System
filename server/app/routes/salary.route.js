import express from "express";
import salaryController from "./../controllers/salary.controller";
import validation from '../middlewares/validation.middleware';
import {
    createSalarySchema,
    updateSalarySchema
} from "../validations/salary.validation";
import { modelFilterSchema } from '../validations/filter.validation';

const router = express.Router();

router.route("/")
    .get(salaryController.findAll)
    .post(validation(createSalarySchema), salaryController.createSalary)
    .patch(validation(updateSalarySchema), salaryController.updateSalary)

router.route("/filter")
    .post(validation(modelFilterSchema), salaryController.getListSalary)

router.route("/:id")
    .get(salaryController.findById)
    .delete(salaryController.deleteSalary)

module.exports = router;