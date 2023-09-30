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
        return next(error);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const data = await positionService.findAll();
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.getListPosition = async (req, res, next) => {
    try {
        const data = await positionService.filterListPosition(req.body);
        return res.send({ data });
    } catch (error) {
        return next(error);
    }
}

exports.createPosition = async (req, res, next) => {
    try {
        const positionExisted = await positionService.findByPositionName(req.body.name);
        if (positionExisted) {
            return next(createError.BadRequest("Position already exists"));
        }

        const data = await positionService.createPosition(req.body);
        return res.send({ message: "Successfully added new position", data });
    } catch (error) {
        return next(error);
    }
}

exports.updatePosition = async (req, res, next) => {
    try {
        const positionExisted = await positionService.findByPositionName(req.body.name);
        if (positionExisted && positionExisted.id !== req.body.positionId) {
            return next(createError.BadRequest("Position name already exists"));
        }

        const foundPosition = await positionService.findById(req.body.positionId);
        if (!foundPosition) {
            return next(createError.BadRequest("Currency not found"));
        }

        await positionService.updatePosition(req.body.positionId, req.body);
        return res.send({ message: "Successful update" });
    } catch (error) {
        return next(error);
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
            createError.BadRequest("This position cannot be deleted")
        );
    }
}