import express from "express";
import positionController from "./../controllers/position.controller";
import validation from '../middlewares/validation.middleware';
import {
    createPositionSchema,
    updatePositionSchema
} from "../validations/position.validation";
import { modelFilterSchema } from '../validations/filter.validation';

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