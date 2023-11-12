import config from '../config/configServer';
import { createJwt } from './../utils/jwt.util';
import { hashToken } from "./../utils/hash.util";
import db from "./../models/index";

class QRCodeService {
    async findById(id) {
        const result = await db.QRCode.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async createQRCode(payload) {
        const result = await db.QRCode.create(
            { hashQRCodeToken: '' },
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
        const hashQRCodeToken = await hashToken(qrCodeToken);
        await this.updateQRCode(result.null, { hashQRCodeToken })
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

    async deleteAllQRCodes() {
        await db.QRCode.destroy({
            where: {}
        });
    }

}

module.exports = new QRCodeService;