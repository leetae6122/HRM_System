import currencyService from "./../services/currency.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await currencyService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest("Currency not found"));
        }
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await currencyService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.createCurrency = async (req, res, next) => {
    try {
        const currencyExist = await currencyService.findByCurrencyCode(req.body.code);
        if (currencyExist) {
            return next(createError.BadRequest("Currency code already exists"));
        }

        const data = await currencyService.createCurrency(req.body);
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.updateCurrency = async (req, res, next) => {
    try {
        const foundCurrency = await currencyService.findById(req.body.currencyId);
        if (!foundCurrency) {
            return next(createError.BadRequest("Currency not found"));
        }
        if (foundCurrency.code === req.body.code) {
            return next(createError.BadRequest("Currency code already exists"));
        }

        await currencyService.updateCurrency(req.body.currencyId, req.body);
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.deleteCurrency = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest("CurrencyId cannot be empty"));
        }
        await currencyService.deleteCurrency(req.params.id);
        return res.send({ message: "Successful deletion" });
    } catch (error) {
        return next(
            createError.BadRequest("Deletion cannot be performed with this currency")
        );
    }
}