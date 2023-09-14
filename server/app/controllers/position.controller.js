import positionService from "./../services/position.service";
import createError from 'http-errors';

exports.findById = async (req, res, next) => {
    try {
        const data = await positionService.findById(req.params.id);
        if (!data) {
            return next(createError.BadRequest("Position not found"));
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
        const data = await positionService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.getListPosition = async (req, res, next) => {
    try {
        const data = await positionService.filterListPosition(req.body);
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.createPosition = async (req, res, next) => {
    try {
        const positionExist = await positionService.findByPositionName(req.body.positionName);
        if (positionExist) {
            return next(createError.BadRequest("Position already exists"));
        }

        const data = await positionService.createPosition(req.body);
        return res.send({ data });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.updatePosition = async (req, res, next) => {
    try {
        const foundPosition = await positionService.findById(req.body.positionId);
        if (!foundPosition) {
            return next(createError.BadRequest("Currency not found"));
        }
        if (foundPosition.positionName === req.body.positionName) {
            return next(createError.BadRequest("Position already exists"));
        }

        await positionService.updatePosition(req.body.positionId, req.body);
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(
            createError.InternalServerError(error.message)
        );
    }
}

exports.deletePosition = async (req, res, next) => {
    try {
        if (!req.params.id && Number(req.params.id)) {
            return next(createError.BadRequest("PositionId cannot be empty"));
        }
        await positionService.deletePosition(req.params.id);
        return res.send({ message: "Successful deletion" });
    } catch (error) {
        return next(
            createError.BadRequest("Deletion cannot be performed with this position")
        );
    }
}