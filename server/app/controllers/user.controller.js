import userService from "./../services/user.service";
import createError from 'http-errors';
import { compareHashedData } from './../utils/hash.util';

exports.getUserProfile = async (req, res, next) => {
    try {
        const data = await userService.getUserProfile(req.user.id);
        if (!data) {
            return next(createError.BadRequest("User not found"));
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
            return next(createError.BadRequest("User not found"));
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
            return next(createError.BadRequest("Username already exists"));
        }

        const data = await userService.createUser(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const foundUser = await userService.findById(req.body.userId);
        if (!foundUser) {
            return next(createError.BadRequest("User not found"));
        }

        await userService.updateUser(req.body.userId, req.body);
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(error);
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
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(error);
    }
}
