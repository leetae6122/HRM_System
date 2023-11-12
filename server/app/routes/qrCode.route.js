import express from "express";
import qrCodeController from "./../controllers/qrCode.controller";
import validation from '../middlewares/validation.middleware';
import {
    createQRCodeSchema,
} from "../validations/qrCode.validation";

const router = express.Router();

router.route("/")
    .post(validation(createQRCodeSchema), qrCodeController.createQRCode)

router.route("/:id")
    .delete(qrCodeController.deleteQRCode)
module.exports = router;