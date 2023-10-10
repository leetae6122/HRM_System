import userService from "./../services/user.service";
import authService from "./../services/auth.service";
import createError from 'http-errors';
import {
    MSG_ERROR_WRONG_LOGIN_INFORMATION,
    MSG_ERROR_USER_NOT_FOUND,
    MSG_INVALID_TOKEN,
    MSG_REFRESH_TOKEN_DOES_NOT_MATCH,
    MSG_SENT_MAIL_FORGOT_PASSWORD,
    MSG_TOKEN_DOES_NOT_MATCH,
    MSG_NOT_TOKEN_FOR_AUTH,
    MSG_ERROR_WRONG_FORGOT_PASS_INFORMATION
} from '../utils/message.util';
import { compareHashedData } from "../utils/hash.util";
import config from '../config/configServer';
import { verifyToken } from '../utils/jwt.util';
import mailService from './../services/mail.service'

exports.login = async (req, res, next) => {
    try {
        const { username, password, isRemember } = req.body;
        const foundUser = await userService.findByUsernameHideToken(username);
        if (!foundUser) {
            return next(createError.BadRequest(MSG_ERROR_WRONG_LOGIN_INFORMATION));
        }

        if (!foundUser.isActive) {
            return next(createError.BadRequest("The user is not activated"));
        }

        const isMatch = await compareHashedData(password, foundUser.password)
        if (!isMatch) return next(createError.BadRequest(MSG_ERROR_WRONG_LOGIN_INFORMATION));

        delete foundUser.password;
        const jwtPayload = {
            id: foundUser.id,
            username: foundUser.username,
            employeeId: foundUser.employeeId
        }
        const accessToken = await authService.createJwtAccess(jwtPayload);
        if (isRemember) {
            const refreshToken = await authService.createJwtRefresh(jwtPayload);

            return res.send({
                accessToken,
                refreshToken,
                data: foundUser
            });
        }
        return res.send({ accessToken, data: foundUser });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while logging the user")
        );
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const authHeader = await req.header('Authorization');
        if (!authHeader) return next(createError.BadRequest(MSG_NOT_TOKEN_FOR_AUTH));
        const bearer = await authHeader.split(' ')[0];
        const refreshToken = await authHeader.split(' ')[1];

        if (!refreshToken && bearer !== "Bearer") {
            return next(createError.BadRequest(MSG_NOT_TOKEN_FOR_AUTH));
        }

        const payload = verifyToken(refreshToken, config.jwt.refresh.secret);
        if (!payload) {
            return next(createError.BadRequest(MSG_INVALID_TOKEN));
        }

        const foundUser = await userService.findById(payload.id);
        if (!foundUser) {
            return next(createError.NotFound(MSG_ERROR_USER_NOT_FOUND));
        }
        if (!foundUser.refreshTokenHash) {
            return next(createError.BadRequest(MSG_INVALID_TOKEN));
        }

        const isMatch = await compareHashedData(
            refreshToken.slice(refreshToken.lastIndexOf('.')),
            foundUser.refreshTokenHash
        )
        if (!isMatch) {
            return next(createError.BadRequest(MSG_REFRESH_TOKEN_DOES_NOT_MATCH));
        }

        const jwtPayload = {
            id: foundUser.id,
            username: foundUser.username,
            employeeId: foundUser.employeeId
        }
        const newAccessToken = await authService.createJwtAccess(jwtPayload);
        const newRefreshToken = await authService.createJwtRefresh(jwtPayload);

        return res.send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        next(createError.InternalServerError("An error occurred while refresh token"))
    }
}

exports.logout = async (req, res, next) => {
    try {
        const { user } = req;
        const foundUser = await userService.findById(user.id);
        if (!foundUser) {
            return next(createError.NotFound(MSG_ERROR_USER_NOT_FOUND));
        }

        if (foundUser.refreshTokenHash) {
            await authService.logout(user.id);
        }
        res.send({ message: "Log Out" });
    } catch (error) {
        return next(
            createError.InternalServerError(`Error logout`)
        );
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const foundUser = await userService.findByUsernameHideToken(username);
        if (!foundUser) {
            return next(createError.BadRequest(MSG_ERROR_WRONG_FORGOT_PASS_INFORMATION));
        }
        if (foundUser.profile.email !== email) {
            return next(createError.BadRequest(MSG_ERROR_WRONG_FORGOT_PASS_INFORMATION));
        }

        const jwtPayload = {
            id: foundUser.id,
            username: foundUser.username,
            employeeId: foundUser.employeeId
        }
        const tokenResetPassword = await authService.createJwtResetPassword(jwtPayload);
        await mailService.sendMailForgotPassword(email, tokenResetPassword)

        return res.send({ message: MSG_SENT_MAIL_FORGOT_PASSWORD });
    } catch (error) {
        return next(
            createError.InternalServerError(`Error forgot password`)
        );
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { newPassword, token } = req.body;
        const payload = verifyToken(token, config.jwt.reset_password.secret);
        const foundUser = await userService.findById(payload.id);
        if (!foundUser) {
            return next(createError.NotFound(MSG_ERROR_USER_NOT_FOUND));
        }

        const isMatch = await compareHashedData(
            token.slice(token.lastIndexOf('.')),
            foundUser.resetPasswordHash,
        );
        if (!isMatch) {
            return next(createError.BadRequest(MSG_TOKEN_DOES_NOT_MATCH));
        }

        await userService.updateUser(foundUser.id, { password: newPassword, resetPasswordHash: null });
        return res.send({ message: "Successful password reset" });
    } catch (error) {
        return next(createError.BadRequest(MSG_INVALID_TOKEN));
    }
}