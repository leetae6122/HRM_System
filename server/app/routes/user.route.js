import express from "express";
import userController from "./../controllers/user.controller";
import { verifyAdmin } from './../middlewares/auth.middleware';
import validation from '../middlewares/validation.middleware';
import {
    adminCreateUserSchema,
    adminUpdateUserSchema,
    changPasswordSchema
} from './../validations/user.validation';
import { userFilterSchema } from '../validations/filter.validation';

const router = express.Router();

router.route("/")
    .get(userController.getUserProfile)

router.route("/change-password")
    .patch(validation(changPasswordSchema), userController.changePassword)

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
    .post(verifyAdmin, validation(userFilterSchema), userController.getListUser)

module.exports = router;