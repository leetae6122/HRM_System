import express from "express";
import wageController from "../controllers/wage.controller";
import validation from '../middlewares/validation.middleware';
import {
    createWageSchema,
    updateWageSchema
} from "../validations/wage.validation";
import { modelFilterSchema } from '../validations/filter.validation';

const router = express.Router();

router.route("/")
    .get(wageController.findAll)
    .post(validation(createWageSchema), wageController.createWage)
    .patch(validation(updateWageSchema), wageController.updateWage)

router.route("/filter")
    .post(validation(modelFilterSchema), wageController.getListWage)

router.route("/:id")
    .get(wageController.findById)
    .delete(wageController.deleteWage)

module.exports = router;