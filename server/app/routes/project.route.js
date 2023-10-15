import express from "express";
import projectController from "./../controllers/project.controller";
import validation from '../middlewares/validation.middleware';
import {
    createProjectSchema,
    updateProjectSchema
} from "../validations/project.validation";
import { filterSchema } from "../validations/filter.validation";
import { verifyAdmin } from './../middlewares/auth.middleware';

const router = express.Router();

router.route("/")
    .get(projectController.findAll)
    .post(verifyAdmin, validation(createProjectSchema), projectController.createProject)
    .patch(verifyAdmin, validation(updateProjectSchema), projectController.updateProject)

router.route("/filter")
    .post(verifyAdmin, validation(filterSchema), projectController.getListProject)

router.route("/:id")
    .all(verifyAdmin)
    .get(projectController.findById)
    .delete(projectController.deleteProject)
module.exports = router;