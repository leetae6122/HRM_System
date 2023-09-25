import express from "express";
import currencyController from "./../controllers/currency.controller";
import validation from '../middlewares/validation.middleware';
import {
    createCurrencySchema,
    updateCurrencySchema
} from "../validations/currency.validation";
import { filterSchema } from "../validations/common.validation";

const router = express.Router();

router.route("/")
    .get(currencyController.findAll)
    .post(validation(createCurrencySchema), currencyController.createCurrency)
    .patch(validation(updateCurrencySchema), currencyController.updateCurrency)

router.route("/filter")
    .post(validation(filterSchema), currencyController.getListCurrency)

router.route("/:id")
    .get(currencyController.findById)
    .delete(currencyController.deleteCurrency)
module.exports = router;