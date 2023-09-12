import express from "express";
import positionController from "./../controllers/position.controller";
import { verifyAdmin } from './../middlewares/auth.middleware';
import validation from '../middlewares/validation.middleware';
import {
    createPositionSchema,
    updatePositionSchema
} from "../validations/position.validation";
import { filterSchema } from '../validations/common.validation';

const router = express.Router();

router.route("/")
    .post(validation(filterSchema), positionController.getListPosition)

router.route("/admin")
    .all(verifyAdmin)
    .post(validation(createPositionSchema), positionController.createPosition)
    .patch(validation(updatePositionSchema), positionController.updatePosition)

router.route("/:id")
    .get(positionController.findById)

router.route("/admin/:id")
    .delete(verifyAdmin, positionController.deletePosition)
module.exports = router;