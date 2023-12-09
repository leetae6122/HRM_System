import express from "express";
import qrCodeController from "./../controllers/qrCode.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createQRCodeSchema,
} from "../validations/qrCode.validation.js";

const router = express.Router();

router.route("/")
    .post(validation(createQRCodeSchema), qrCodeController.createQRCode)

router.route("/:id")
    .delete(qrCodeController.deleteQRCode)
module.exports = router;