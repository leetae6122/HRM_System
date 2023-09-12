import createError from 'http-errors';

const validation = (schema) => async (req, res, next) => {
    try {
        const result = await schema.validateAsync(req.body, { abortEarly: false });
        req.body = result;
        return next();
    } catch (error) {
        const msgError = error.details.map((detail) => detail.message);
        return next(createError.BadRequest(msgError));
    }
}

module.exports = validation;