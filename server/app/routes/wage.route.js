import express from "express";
import wageController from "../controllers/wage.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createWageSchema,
    updateWageSchema
} from "../validations/wage.validation.js";
import { modelFilterSchema } from '../validations/filter.validation.js';

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