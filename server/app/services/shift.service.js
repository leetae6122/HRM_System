import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class ShiftService {
    async findById(id) {
        const result = await db.Shift.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Shift.findAll({});
        return result;
    }

    async filterListShift(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Shift.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            raw: true,
            nest: true
        });

        const nextPage = page + 1 > Math.ceil(count / limit) ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            total: count,
            currentPage: page,
            nextPage,
            prevPage,
            data: rows,
        };
    }

    async createShift(payload) {
        const result = await db.Shift.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateShift(id, payload) {
        await db.Shift.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteShift(id) {
        await db.Shift.destroy({
            where: { id }
        });
    }

    async foundShift(shiftId, next) {
        const foundShift = await this.findById(shiftId);
        if (!foundShift) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Shift")));
        }
        return foundShift;
    }
}

module.exports = new ShiftService;