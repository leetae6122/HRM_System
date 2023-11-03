import express from "express";
import rewardPunishmentController from "./../controllers/rewardPunishment.controller";
import validation from '../middlewares/validation.middleware';
import {
    createRewardPunishmentSchema,
    updateRewardPunishmentSchema
} from "../validations/rewardPunishment.validation";
import { modelFilterSchema } from "../validations/filter.validation";
import { verifyAdmin } from '../middlewares/auth.middleware';

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