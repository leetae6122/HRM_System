import userService from "./../services/user.service";
import createError from 'http-errors';
import { compareHashedData } from './../utils/hash.util';

exports.findById = async (req, res, next) => {
    try {
        let data = req.user;
        if (req.params.id) {
            data = await userService.findByIdSecret(req.params.id);
        }
        if (!data) {
            return next(createError.BadRequest("User not found"));
        }
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await userService.findAll();
        if (data.length <= 0){
            return next(createError.BadRequest("User not found"));
        }
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const employeeHasAcc = await userService.findByEmployeeId(req.body.employeeId);
        if(employeeHasAcc){
            return next(createError.BadRequest("The employee already has an account"));
        }

        const foundUser = await userService.findByUsernameHideToken(req.body.username);
        if (foundUser) {
            return next(createError.BadRequest("Username already exists"));
        }

        const data = await userService.createUser(req.body);
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const foundUser = await userService.findById(req.body.userId);
        if (!foundUser) {
            return next(createError.BadRequest("User not found"));
        }

        await userService.updateUser(req.body.userId, req.body);
        return res.send({ message: "Update successful" });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        const isMatch = await compareHashedData(currentPassword, user.password);
        if (!isMatch) {
            return next(createError.BadRequest("The current password is incorrect"));
        }

        await userService.updateUser(req.user.id, { password: newPassword });
        return res.send({ message: "Update successful" });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}
