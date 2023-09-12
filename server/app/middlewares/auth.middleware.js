import createError from 'http-errors';
import userService from "./../services/user.service";
import config from './../config';
import { 
    MSG_INVALID_TOKEN, 
    MSG_ERROR_USER_NOT_FOUND,
    MSG_NOT_TOKEN_FOR_AUTH
 } from './../utils/message.util';
import { verifyToken } from './../utils/jwt.util';

exports.verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = await req.header('Authorization');
        if (!authHeader) return next(createError.BadRequest(MSG_NOT_TOKEN_FOR_AUTH));
        const bearer = await authHeader.split(' ')[0];
        const token = await authHeader.split(' ')[1];

        if (!token && bearer !== "Bearer") {
            return next(createError.BadRequest(MSG_NOT_TOKEN_FOR_AUTH));
        }

        const payload = verifyToken(token, config.jwt.access.secret);
        if (!payload) return next(createError.BadRequest(MSG_INVALID_TOKEN));

        const user = await userService.findByIdSecret(payload.id);
        if (!user) return next(createError.NotFound(MSG_ERROR_USER_NOT_FOUND));
        req.user = user;
        next();
    } catch (error) {
        return next(
            createError.InternalServerError(error)
        );
    }
}

exports.verifyAdmin = async (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return next(
            createError.Unauthorized("You do not have permission to perform this function")
        );
    }
}

exports.verifyAdminOrSelf = async (req, res, next) => {
    if (req.user.employeeId === req.params.id || req.user.isAdmin) {
        next();
    } else {
        return next(
            createError.Unauthorized("You do not have permission to perform this function")
        );
    }
}