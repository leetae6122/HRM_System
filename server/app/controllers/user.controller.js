import userService from "./../services/user.service.js";
import createError from 'http-errors';
import { compareHashedData } from './../utils/hash.util.js';
import {
    MSG_CREATED_SUCCESSFUL,
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_EXISTED,
    MSG_ERROR_ID_EMPTY,
    MSG_ERROR_NOT_FOUND,
    MSG_UPDATE_SUCCESSFUL
} from "../utils/message.util.js";

exports.getUserProfile = async (req, res, next) => {
    try {
        const data = await userService.findByIdSecret(req.user.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("User")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findById = async (req, res, next) => {
    try {
        const data = await userService.findByIdSecret(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("User")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await userService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListUser = async (req, res, next) => {
    try {
        const data = await userService.filterListUser(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}


exports.createUser = async (req, res, next) => {
    try {
        const employeeHasAcc = await userService.findByEmployeeId(req.body.employeeId);
        if (employeeHasAcc) {
            return next(createError.BadRequest("The employee already has an account"));
        }

        const foundUser = await userService.findByUsernameHideToken(req.body.username);
        if (foundUser) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Username")));
        }

        const data = await userService.createUser(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("User"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const foundUser = await userService.findByIdSecret(req.body.userId);
        if (!foundUser) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("User")));
        }

        if (!!foundUser.isAdmin && (!req.body.isActive || !req.body.isAdmin)) {
            const count = await userService.countUserAdminActived();
            if (count === 1) {
                return next(createError.BadRequest("There must be at least one Admin in the system"));
            }
        }
        await userService.updateUser(req.body.userId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("UserId")));
        }
        const foundUser = await userService.findByIdSecret(req.params.id);
        if (!foundUser) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("User")));
        }
        if (!!foundUser.isAdmin && foundUser.isActive) {
            const count = await userService.countUserAdminActived();
            if (count === 1) {
                return next(createError.BadRequest("There must be at least one Admin in the system"));
            }
        }

        await userService.deleteUser(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("User"))
        );
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await userService.findById(req.user.id);
        const isMatch = await compareHashedData(currentPassword, user.password);
        if (!isMatch) {
            return next(createError.BadRequest("The current password is incorrect"));
        }

        await userService.updateUser(req.user.id, { password: newPassword });
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.countUser = async (req, res, next) => {
    try {
        const data = await userService.countUser();
        return res.send({ data })
    } catch (error) {
        return next(error);
    }
}
