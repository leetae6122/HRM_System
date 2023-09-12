require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        access: {
            secret: process.env.SECRET_ACCESS_JWT,
            expire: process.env.EXPIRE_ACCESS_JWT
        },
        refresh: {
            secret: process.env.SECRET_REFRESH_JWT,
            expire: process.env.EXPIRE_REFRESH_JWT
        },
        resetPassword: {
            secret: process.env.SECRET_RESET_PASS_JWT,
            expire: process.env.EXPIRE_RESET_PASS_JWT
        }
    }
};
module.exports = config;