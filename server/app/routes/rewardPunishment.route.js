import express from "express";
import rewardPunishmentController from "./../controllers/rewardPunishment.controller.js";
import validation from '../middlewares/validation.middleware.js';
import {
    createRewardPunishmentSchema,
    updateRewardPunishmentSchema
} from "../validations/rewardPunishment.validation.js";
import { modelFilterSchema } from "../validations/filter.validation.js";
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/")
    .all(verifyAdmin)
    .get(rewardPunishmentController.findAll)
    .post(validation(createRewardPunishmentSchema), rewardPunishmentController.createRewardPunishment)
    .patch(validation(updateRewardPunishmentSchema), rewardPunishmentController.updateRewardPunishment)

router.route("/filter")
    .post(validation(modelFilterSchema), rewardPunishmentController.employeeGetListRewardPunishment)

router.route("/admin/filter")
    .post(verifyAdmin, validation(modelFilterSchema), rewardPunishmentController.adminGetListRewardPunishment)

router.route("/:id")
    .get(rewardPunishmentController.findById)
    .delete(verifyAdmin, rewardPunishmentController.deleteRewardPunishment)
module.exports = router;