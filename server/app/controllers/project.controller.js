import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL,
    MSG_ERROR_DELETE_PROJECT,
    MSG_ERROR_UPDATE_PROJECT,
} from "../utils/message.util";
import projectService from "./../services/project.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await projectService.foundProject(req.params.id, next);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await projectService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListProject = async (req, res, next) => {
    try {
        const data = await projectService.filterListProject(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createProject = async (req, res, next) => {
    try {
        const data = await projectService.createProject(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Project"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateProject = async (req, res, next) => {
    try {
        const foundProject = await projectService.foundProject(req.body.projectId, next);
        if (foundProject.status !== "Upcoming") {
            return next(createError.BadRequest(MSG_ERROR_UPDATE_PROJECT));
        }

        await projectService.updateProject(req.body.projectId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteProject = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("ProjectId")));
        }
        const foundProject = await projectService.foundProject(req.params.id, next);
        if (foundProject.status === "Running") {
            return next(createError.BadRequest(MSG_ERROR_DELETE_PROJECT));
        }

        await projectService.deleteProject(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Project"))
        );
    }
}