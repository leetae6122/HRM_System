import express from "express";
import userController from "./../controllers/user.controller.js";
import { verifyAdmin } from './../middlewares/auth.middleware.js';
import validation from '../middlewares/validation.middleware.js';
import {
    adminCreateUserSchema,
    adminUpdateUserSchema,
    changPasswordSchema
} from './../validations/user.validation.js';
import { modelFilterSchema } from '../validations/filter.validation.js';

const router = express.Router();

router.route("/")
    .get(userController.getUserProfile)

router.route("/change-password")
    .patch(validation(changPasswordSchema), userController.changePassword)

router.route("/count")
    .get(verifyAdmin, userController.countUser)

router.route("/admin")
    .all(verifyAdmin)
    .get(userController.findAll)
    .post(validation(adminCreateUserSchema), userController.createUser)
    .patch(validation(adminUpdateUserSchema), userController.updateUser)

router.route("/admin/:id")
    .all(verifyAdmin)
    .delete(userController.deleteUser)
    .get(userController.findById)
    
router.route("/admin/filter")
    .post(verifyAdmin, validation(modelFilterSchema), userController.getListUser)

module.exports = router;