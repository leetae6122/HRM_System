import express from "express";
import taskController from "./../controllers/task.controller";
import validation from '../middlewares/validation.middleware';
import {
    createTaskSchema,
    updateTaskSchema
} from "../validations/task.validation";
import { filterSchema } from "../validations/filter.validation";
import { verifyAdmin } from './../middlewares/auth.middleware';

const router = express.Router();

router.route("/")
    .get(taskController.findAll)
    .post(verifyAdmin, validation(createTaskSchema), taskController.createTask)
    .patch(verifyAdmin, validation(updateTaskSchema), taskController.updateTask)

router.route("/filter")
    .post(verifyAdmin, validation(filterSchema), taskController.getListTask)

router.route("/:id")
    .all(verifyAdmin)
    .get(taskController.findById)
    .delete(taskController.deleteTask)
module.exports = router;