import express from "express";
import departmentController from "./../controllers/department.controller";
import validation from '../middlewares/validation.middleware';
import {
    createDepartmentSchema,
    updateDepartmentSchema
} from "../validations/department.validation";
import { filterSchema } from "../validations/filter.validation";

const router = express.Router();

router.route("/")
    .get(departmentController.findAll)
    .post(validation(createDepartmentSchema), departmentController.createDepartment)
    .patch(validation(updateDepartmentSchema), departmentController.updateDepartment)

router.route("/filter")
    .post(validation(filterSchema), departmentController.getListDepartment)

router.route("/:id")
    .get(departmentController.findById)
    .delete(departmentController.deleteDepartment)
module.exports = router;