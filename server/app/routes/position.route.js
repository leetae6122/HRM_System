import express from "express";
import positionController from "./../controllers/position.controller";
import validation from '../middlewares/validation.middleware';
import {
    createPositionSchema,
    updatePositionSchema
} from "../validations/position.validation";
import { filterSchema } from '../validations/filter.validation';

const router = express.Router();

router.route("/")
    .get(positionController.findAll)
    .post(validation(createPositionSchema), positionController.createPosition)
    .patch(validation(updatePositionSchema), positionController.updatePosition)

router.route("/filter")
    .post(validation(filterSchema), positionController.getListPosition)

router.route("/:id")
    .get(positionController.findById)
    .delete(positionController.deletePosition)

module.exports = router;