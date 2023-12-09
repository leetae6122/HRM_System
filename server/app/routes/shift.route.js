import express from "express";
import shiftController from "./../controllers/shift.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createShiftSchema,
    updateShiftSchema
} from "../validations/shift.validation.js";
import { filterSchema } from "../validations/filter.validation.js";
import { verifyAdmin, verifyAdminOrDepartmentManager } from './../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/")
    .get(verifyAdminOrDepartmentManager, shiftController.findAll)
    .post(verifyAdmin, validation(createShiftSchema), shiftController.createShift)
    .patch(verifyAdmin, validation(updateShiftSchema), shiftController.updateShift)

router.route("/current/list")
    .get(verifyAdmin, shiftController.getCurrentShiftList)
    
router.route("/filter")
    .post(verifyAdmin, validation(filterSchema), shiftController.getListShift)

router.route("/:id")
    .all(verifyAdmin)
    .get(shiftController.findById)
    .delete(shiftController.deleteShift)
module.exports = router;