import express from "express";
import userController from "./../controllers/user.controller";
import { verifyAdmin } from './../middlewares/auth.middleware';
import validation from '../middlewares/validation.middleware';
import {
    adminCreateUserSchema,
    adminUpdateUserSchema,
    changPasswordSchema
} from './../validations/user.validation';
import { filterSchema } from '../validations/common.validation';

const router = express.Router();

router.route("/")
    .get(userController.findById)

router.route("/filter")
    .post(validation(filterSchema), userController.getListUser)

router.route("/change-password")
    .patch(validation(changPasswordSchema), userController.changePassword)

router.route("/admin")
    .all(verifyAdmin)
    .get(userController.findAll)
    .post(validation(adminCreateUserSchema), userController.createUser)
    .patch(validation(adminUpdateUserSchema), userController.updateUser)

router.route("/admin/:id")
    .all(verifyAdmin)
    .get(userController.findById)

module.exports = router;