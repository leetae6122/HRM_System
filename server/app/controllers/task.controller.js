import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util";
import taskService from "./../services/task.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await taskService.foundTask(req.params.id, next);

        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await taskService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListTask = async (req, res, next) => {
    try {
        const data = await taskService.filterListTask(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createTask = async (req, res, next) => {
    try {
        const data = await taskService.createTask(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Task"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        await taskService.foundTask(req.body.taskId, next);
        await taskService.updateTask(req.body.taskId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("TaskId")));
        }
        await taskService.foundTask(req.params.id, next);

        await taskService.deleteTask(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Task"))
        );
    }
}