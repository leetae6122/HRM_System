import express from "express";
import projectController from "./../controllers/project.controller";
import validation from '../middlewares/validation.middleware';
import {
    createProjectSchema,
    updateProjectSchema
} from "../validations/project.validation";
import { filterSchema } from "../validations/filter.validation";

const router = express.Router();

router.route("/")
    .get(projectController.findAll)
    .post(validation(createProjectSchema), projectController.createProject)
    .patch(validation(updateProjectSchema), projectController.updateProject)

router.route("/filter")
    .post(validation(filterSchema), projectController.getListProject)

router.route("/:id")
    .get(projectController.findById)
    .delete(projectController.deleteProject)
module.exports = router;