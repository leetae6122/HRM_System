import express from "express";
import positionController from "./../controllers/position.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createPositionSchema,
    updatePositionSchema
} from "../validations/position.validation.js";
import { modelFilterSchema } from '../validations/filter.validation.js';

const router = express.Router();

router.route("/")
    .get(positionController.findAll)
    .post(validation(createPositionSchema), positionController.createPosition)
    .patch(validation(updatePositionSchema), positionController.updatePosition)
router.route("/department/:id")
    .get(positionController.findAllWithDepartmentId)

router.route("/filter")
    .post(validation(modelFilterSchema), positionController.getListPosition)

router.route("/count-employees")
    .get(positionController.countEmployees)

router.route("/:id")
    .get(positionController.findById)
    .delete(positionController.deletePosition)

module.exports = router;