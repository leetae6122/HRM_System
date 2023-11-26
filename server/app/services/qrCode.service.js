import config from '../config/configServer';
import { createJwt } from './../utils/jwt.util';
import { hashToken } from "./../utils/hash.util";
import db from "./../models/index";
import dayjs from 'dayjs';

class QRCodeService {
    async findById(id) {
        const result = await db.QRCode.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll(where) {
        const result = await db.QRCode.findAll({
            where,
            raw: true,
            nest: true
        })
        return result;
    }

    async createQRCode(payload) {
        const result = await db.QRCode.create(
            {
                hashQRCodeToken: '',
                expiredAt: ''
            },
            {
                raw: true,
                nest: true
            }
        );

        const tokenPayload = {
            qrCodeId: result.null,
            ...payload
        }
        const qrCodeToken = createJwt(
            tokenPayload,
            config.jwt.qr_code.secret,
            config.jwt.qr_code.expire
        );

        const expiredAt = dayjs().add(
            Number(config.jwt.qr_code.expire.slice(0, -1)),
            config.jwt.qr_code.expire.slice(-1),
        ).toDate();
        const hashQRCodeToken = await hashToken(qrCodeToken);
        await this.updateQRCode(result.null,
            {
                hashQRCodeToken,
                expiredAt
            }
        )
        return qrCodeToken;
    }

    async updateQRCode(id, payload) {
        await db.QRCode.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteQRCode(id) {
        await db.QRCode.destroy({
            where: { id }
        });
    }
}

module.exports = new QRCodeService;