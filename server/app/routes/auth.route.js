import express from "express";
import authController from "./../controllers/auth.controller.js";
import validation from './../middlewares/validation.middleware.js';
import {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} from './../validations/auth.validation.js';
import { verifyAccessToken } from './../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/login")
    .post(validation(loginSchema), authController.login)

router.route("/refresh-token")
    .post(authController.refreshToken)

router.route("/logout")
    .post(verifyAccessToken, authController.logout)

router.route("/forgot-password")
    .post(validation(forgotPasswordSchema), authController.forgotPassword)

router.route("/reset-password")
    .post(validation(resetPasswordSchema), authController.resetPassword)

module.exports = router;