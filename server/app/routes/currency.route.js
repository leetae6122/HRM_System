import express from "express";
import currencyController from "./../controllers/currency.controller";
import { verifyAdmin } from './../middlewares/auth.middleware';
import validation from '../middlewares/validation.middleware';
import {
    createCurrencySchema,
    updateCurrencySchema
} from "../validations/currency.validation";

const router = express.Router();

router.route("/")
    .get(currencyController.findAll)

router.route("/admin")
    .all(verifyAdmin)
    .post(validation(createCurrencySchema), currencyController.createCurrency)
    .patch(validation(updateCurrencySchema), currencyController.updateCurrency)

router.route("/:id")
    .get(currencyController.findById)
    .delete(verifyAdmin, currencyController.deleteCurrency)
module.exports = router;