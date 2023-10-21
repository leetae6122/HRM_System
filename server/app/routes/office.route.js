import express from "express";
import officeController from "./../controllers/office.controller";
import validation from '../middlewares/validation.middleware';
import {
    createOfficeSchema,
    updateOfficeSchema
} from "../validations/office.validation";
import { modelFilterSchema } from "../validations/filter.validation";

const router = express.Router();

router.route("/")
    .get(officeController.findAll)
    .post(validation(createOfficeSchema), officeController.createOffice)
    .patch(validation(updateOfficeSchema), officeController.updateOffice)

router.route("/filter")
    .post(validation(modelFilterSchema), officeController.getListOffice)

router.route("/:id")
    .get(officeController.findById)
    .delete(officeController.deleteOffice)
module.exports = router;