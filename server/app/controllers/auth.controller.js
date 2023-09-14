import userService from "./../services/user.service";
import authService from "./../services/auth.service";
import createError from 'http-errors';
import {
    MSG_ERROR_WRONG_LOGIN_INFORMATION,
    MSG_ERROR_USER_NOT_FOUND,
    MSG_INVALID_TOKEN,
    MSG_REFRESH_TOKEN_DOES_NOT_MATCH,
    MSG_SENT_MAIL_FORGOT_PASSWORD,
    MSG_TOKEN_DOES_NOT_MATCH
} from '../utils/message.util';
import { compareHashedData } from "../utils/hash.util";
import config from '../config';
import { verifyToken } from '../utils/jwt.util';

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
        if (isRemember && isRemember === true && typeof isRemember === 'boolean') {
            const refreshToken = await authService.createJwtRefresh(jwtPayload);
            authService.setCookie(res, "refreshToken", refreshToken);

            return res.send({
                accessToken: accessToken,
                data: foundUser
            });
        }
        return res.send({ accessToken: accessToken, data: foundUser });
    } catch (error) {
        return next(
            createError.InternalServerError("An error occurred while logging the user")
        );
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(
                createError.BadRequest("You're not authenticated")
            );
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
        authService.setCookie(res, "refreshToken", newRefreshToken);

        return res.send({
            accessToken: newAccessToken,
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
        res.clearCookie("refreshToken");
        res.send({ message: "Log Out" });
        res.end();
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
            return next(createError.BadRequest("Your username/email is incorrect"));
        }
        if (foundUser.profile.email !== email) {
            return next(createError.BadRequest("Your username/email is incorrect"));
        }

        const jwtPayload = {
            id: foundUser.id,
            username: foundUser.username,
            employeeId: foundUser.employeeId
        }
        const tokenResetPassword = await authService.createJwtResetPassword(jwtPayload);
        await authService.sendMailForgotPassword(email, tokenResetPassword)

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

        await userService.updateUser(foundUser.id, { password: newPassword });
        return res.send({ message: "Successful password reset" });
    } catch (error) {
        return next(
            createError.InternalServerError(`Error reset password`)
        );
    }
}