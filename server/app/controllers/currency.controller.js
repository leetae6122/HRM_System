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
            return next(createError.BadRequest("Currency code already exists"));
        }

        const data = await currencyService.createCurrency(req.body);
        return res.send({ message: "Successfully added new currency", data });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.updateCurrency = async (req, res, next) => {
    try {
        const currencyExisted = await currencyService.findByCurrencyCode(req.body.code);
        if (currencyExisted && currencyExisted.id !== req.body.currencyId) {
            return next(createError.BadRequest("Currency code already exists"));
        }
        const foundCurrency = await currencyService.findById(req.body.currencyId);
        if (!foundCurrency) {
            return next(createError.BadRequest("Currency not found"));
        }

        await currencyService.updateCurrency(req.body.currencyId, req.body);
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(error);
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
            createError.BadRequest("This currency cannot be deleted")
        );
    }
}