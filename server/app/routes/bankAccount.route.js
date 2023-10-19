import express from "express";
import bankAccountController from "./../controllers/bankAccount.controller";
import validation from '../middlewares/validation.middleware';
import {
    createBankAccountSchema,
    updateBankAccountSchema
} from "../validations/bankAccount.validation";

const router = express.Router();

router.route("/")
    .get(bankAccountController.findAll)
    .post(validation(createBankAccountSchema), bankAccountController.createBankAccount)
    .patch(validation(updateBankAccountSchema), bankAccountController.updateBankAccount)

router.route("/:id")
    .get(bankAccountController.findById)
    .delete(bankAccountController.deleteBankAccount)
module.exports = router;