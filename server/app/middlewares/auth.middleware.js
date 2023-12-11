import createError from 'http-errors';
import userService from "./../services/user.service.js";
import employeeService from "./../services/employee.service.js";
import config from '../config/configServer.js';
import {
    MSG_INVALID_TOKEN,
    MSG_ERROR_NOT_FOUND,
    MSG_NOT_TOKEN_FOR_AUTH
} from './../utils/message.util.js';
import { verifyToken } from './../utils/jwt.util.js';
import { BlockList } from "net";
import _ from 'lodash';

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
        if (!user) return next(createError.NotFound(MSG_ERROR_NOT_FOUND("User")));
        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'jwt expired') {
            return next(
                createError.Unauthorized('Access Token expired')
            );
        }

        return next(
            createError.InternalServerError(error.message)
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

exports.verifyAdminOrDepartmentManager = async (req, res, next) => {
    const employee = await employeeService.getManageDepartment(req.user.employeeId);
    if (employee.manageDepartment.id || req.user.isAdmin) {
        // req.manageDepartmentId = employee.manageDepartment.id;
        next();
    } else {
        return next(createError.Unauthorized('You are not a department manager to perform this function'));
    }
}

exports.allowIPMiddleware = (req, res, next) => {
    const ipRange = _.compact(config.app.ip_range.split(','));
    if (_.isEmpty(ipRange)) return next();
    if(ipRange.length !== 2 || ipRange.length !== 0){
        return next(createError.InternalServerError('Error setting ip range environment'));
    }
    const ip = req.headers['x-forwarded-for'].split(', ')[0];
    const blockList = new BlockList();
    blockList.addRange(ipRange[0], ipRange[1])
    if (blockList.check(ip)) {
        return next();
    } else {
        return next(createError.Forbidden('Access denied'));
    }
};