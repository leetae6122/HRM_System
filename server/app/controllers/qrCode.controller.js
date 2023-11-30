import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_ID_EMPTY,
    MSG_ERROR_NOT_FOUND,
} from "../utils/message.util";
import qrCodeService from "./../services/qrCode.service";
import createError from 'http-errors';
import QRCode from 'qrcode';
import config from '../config/configServer';

exports.createQRCode = async (req, res, next) => {
    try {
        const token = await qrCodeService.createQRCode(req.body);
        const url = `${config.app.client_url}/timekeeper?token=${token}`;
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        return res.send({ data: qrCodeDataUrl });
    } catch (error) {
        return next(error);
    }
}

exports.deleteQRCode = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("QRCodeId")));
        }
        
        const foundQRCode = await qrCodeService.findById(req.params.id);
        if (!foundQRCode) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("QRCode")));
        }
        await qrCodeService.deleteQRCode(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("QRCode"))
        );
    }
}