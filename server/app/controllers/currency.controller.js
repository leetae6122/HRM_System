import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE,
    MSG_ERROR_EXISTED,
    MSG_ERROR_NOT_FOUND,
    MSG_ERROR_ID_EMPTY,
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util";
import currencyService from "./../services/currency.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await currencyService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Currency")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await currencyService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListCurrency = async (req, res, next) => {
    try {
        const data = await currencyService.filterListCurrency(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createCurrency = async (req, res, next) => {
    try {
        const currencyExisted = await currencyService.findByCurrencyCode(req.body.code);
        if (currencyExisted) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Currency code")));
        }

        const data = await currencyService.createCurrency(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Currency"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateCurrency = async (req, res, next) => {
    try {
        const currencyExisted = await currencyService.findByCurrencyCode(req.body.code);
        if (currencyExisted && currencyExisted.id !== req.body.currencyId) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Currency code")));
        }
        const foundCurrency = await currencyService.findById(req.body.currencyId);
        if (!foundCurrency) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Currency")));
        }

        await currencyService.updateCurrency(req.body.currencyId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteCurrency = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("CurrencyId")));
        }
        const foundCurrency = await currencyService.findById(req.params.id);
        if (!foundCurrency) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Currency")));
        }

        await currencyService.deleteCurrency(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Currency"))
        );
    }
}