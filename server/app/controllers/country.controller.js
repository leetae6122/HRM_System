import {
    MSG_DELETE_SUCCESSFUL,
    MSG_ERROR_DELETE, 
    MSG_ERROR_EXISTED, 
    MSG_ERROR_NOT_FOUND, 
    MSG_ERROR_ID_EMPTY, 
    MSG_UPDATE_SUCCESSFUL,
    MSG_CREATED_SUCCESSFUL
} from "../utils/message.util";
import countryService from "./../services/country.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await countryService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Country")));
        }
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await countryService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListCountry = async (req, res, next) => {
    try {
        const data = await countryService.filterListCountry(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createCountry = async (req, res, next) => {
    try {
        const countryExisted = await countryService.findByIsoCode(req.body.isoCode);
        if (countryExisted) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Country IsoCode")));
        }

        const data = await countryService.createCountry(req.body);
        return res.send({ message: MSG_CREATED_SUCCESSFUL("Country"), data });
    } catch (error) {
        return next(error);
    }
}

exports.updateCountry = async (req, res, next) => {
    try {
        const countryExisted = await countryService.findByIsoCode(req.body.isoCode);
        if (countryExisted && countryExisted.id !== req.body.countryId) {
            return next(createError.BadRequest(MSG_ERROR_EXISTED("Country IsoCode")));
        }
        await countryService.foundCountry(req.body.countryId, next);

        await countryService.updateCountry(req.body.countryId, req.body);
        return res.send({ message: MSG_UPDATE_SUCCESSFUL });
    } catch (error) {
        return next(error);
    }
}

exports.deleteCountry = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest(MSG_ERROR_ID_EMPTY("CountryId")));
        }
        await countryService.foundCountry(req.params.id, next);

        await countryService.deleteCountry(req.params.id);
        return res.send({ message: MSG_DELETE_SUCCESSFUL });
    } catch (error) {
        return next(
            createError.BadRequest(MSG_ERROR_DELETE("Country"))
        );
    }
}