import express from "express";
import countryController from "./../controllers/country.controller";
import validation from '../middlewares/validation.middleware';
import {
    createCountrySchema,
    updateCountrySchema
} from "../validations/country.validation";
import { filterSchema } from "../validations/filter.validation";

const router = express.Router();

router.route("/")
    .get(countryController.findAll)
    .post(validation(createCountrySchema), countryController.createCountry)
    .patch(validation(updateCountrySchema), countryController.updateCountry)

router.route("/filter")
    .post(validation(filterSchema), countryController.getListCountry)

router.route("/:id")
    .get(countryController.findById)
    .delete(countryController.deleteCountry)
module.exports = router;