import express from "express";
import taskController from "./../controllers/task.controller";
import validation from '../middlewares/validation.middleware';
import {
    createTaskSchema,
    updateTaskSchema
} from "../validations/task.validation";
import { filterSchema } from "../validations/filter.validation";

const router = express.Router();

router.route("/")
    .get(taskController.findAll)
    .post(validation(createTaskSchema), taskController.createTask)
    .patch(validation(updateTaskSchema), taskController.updateTask)

router.route("/filter")
    .post(validation(filterSchema), taskController.getListTask)

router.route("/:id")
    .get(taskController.findById)
    .delete(taskController.deleteTask)
module.exports = router;