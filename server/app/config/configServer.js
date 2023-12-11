require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT || 3000,
        client_url: process.env.CLIENT_URL,
        ip_range: process.env.IP_RANGE
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
        reset_password: {
            secret: process.env.SECRET_RESET_PASS_JWT,
            expire: process.env.EXPIRE_RESET_PASS_JWT
        },
        qr_code: {
            secret: process.env.SECRET_QR_CODE_JWT,
            expire: process.env.EXPIRE_QR_CODE_JWT
        }
    },
    mailer: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
        from: process.env.MAIL_FROM
    },
    upload: {
        name: process.env.CLOUDINARY_NAME,
        key: process.env.CLOUDINARY_KEY,
        secret: process.env.CLOUDINARY_SECRET,
    }
};
module.exports = config;