import express from "express";
import allowanceController from "./../controllers/allowance.controller";
import validation from '../middlewares/validation.middleware';
import {
    createAllowanceSchema,
    updateAllowanceSchema
} from "../validations/allowance.validation";
import { modelFilterSchema } from "../validations/filter.validation";
import { verifyAdmin } from '../middlewares/auth.middleware';

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