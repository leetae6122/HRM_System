import express from "express";
import allowanceController from "./../controllers/allowance.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createAllowanceSchema,
    updateAllowanceSchema
} from "../validations/allowance.validation.js";
import { modelFilterSchema } from "../validations/filter.validation.js";
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/")
    .all(verifyAdmin)
    .get(allowanceController.findAll)
    .post(validation(createAllowanceSchema), allowanceController.createAllowance)
    .patch(validation(updateAllowanceSchema), allowanceController.updateAllowance)

router.route("/filter")
    .post(validation(modelFilterSchema), allowanceController.employeeGetListAllowance)

router.route("/admin/filter")
    .post(verifyAdmin, validation(modelFilterSchema), allowanceController.adminGetListAllowance)

router.route("/:id")
    .get(allowanceController.findById)
    .delete(verifyAdmin, allowanceController.deleteAllowance)
module.exports = router;