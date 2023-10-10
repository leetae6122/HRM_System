import config from '../config/configServer';
import { createJwt } from './../utils/jwt.util';
import { hashToken } from "./../utils/hash.util";
import userService from "./user.service";

class AuthService {
    async createJwtAccess(payload) {
        return createJwt(
            payload,
            config.jwt.access.secret,
            config.jwt.access.expire
        );
    }

    async createJwtRefresh(payload) {
        const refreshToken = createJwt(
            payload,
            config.jwt.refresh.secret,
            config.jwt.refresh.expire
        );
        const refreshTokenHash = await hashToken(refreshToken);
        await userService.updateUser(payload.id, { refreshTokenHash });
        return refreshToken;
    }

    async createJwtResetPassword(payload) {
        const resetPasswordToken = createJwt(
            payload,
            config.jwt.reset_password.secret,
            config.jwt.reset_password.expire
        );
        const resetPasswordHash = await hashToken(resetPasswordToken)
        await userService.updateUser(payload.id, { resetPasswordHash });
        return resetPasswordToken;
    }

    async logout(id) {
        await userService.updateUser(id, { refreshTokenHash: null });
    }
}

module.exports = new AuthService;