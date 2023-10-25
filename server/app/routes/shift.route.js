import express from "express";
import shiftController from "./../controllers/shift.controller";
import validation from '../middlewares/validation.middleware';
import {
    createShiftSchema,
    updateShiftSchema
} from "../validations/shift.validation";
import { filterSchema } from "../validations/filter.validation";

const router = express.Router();

router.route("/")
    .get(shiftController.findAll)
    .post(validation(createShiftSchema), shiftController.createShift)
    .patch(validation(updateShiftSchema), shiftController.updateShift)

router.route("/filter")
    .post(validation(filterSchema), shiftController.getListShift)

router.route("/:id")
    .get(shiftController.findById)
    .delete(shiftController.deleteShift)
module.exports = router;