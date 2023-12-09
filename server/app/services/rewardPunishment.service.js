import { MSG_ERROR_NOT_FOUND } from "../utils/message.util.js";
import db from "./../models/index.js";
import createError from 'http-errors';
import _ from 'lodash';

class RewardPunishmentService {
    async findById(id) {
        const result = await db.RewardPunishment.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ],
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll(body) {
        if (body) {
            const where = body.where;
            const order = body.order;

            const result = await db.RewardPunishment.findAll({
                where,
                order,
                raw: true,
                nest: true
            })
            return result;
        }
        const result = await db.RewardPunishment.findAll({});
        return result;
    }

    async filterListRewardPunishment(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;
        const employeeFilter = body.modelEmployee;

        const offset = (page - 1) * limit;

        let count = 0;
        let rows = [];
        const data1 = await db.RewardPunishment.findAndCountAll({
            where,
            offset,
            limit,
            order,
            attributes,
            include: [
                { model: db.Employee, as: 'employeeData' },
                { model: db.Employee, as: 'adderData' }
            ],
            raw: true,
            nest: true
        });

        if ((data1.count === 0 || _.isEmpty(where)) && !_.isEmpty(employeeFilter)) {
            const data2 = await db.RewardPunishment.findAndCountAll({
                where: {},
                offset,
                limit,
                order,
                attributes,
                include: [
                    { model: db.Employee, as: 'employeeData', ...employeeFilter },
                    { model: db.Employee, as: 'adderData' }
                ],
                raw: true,
                nest: true
            });
            count = data2.count;
            rows = data2.rows;
        } else {
            count = data1.count;
            rows = data1.rows;
        }

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

    async createRewardPunishment(payload) {
        const result = await db.RewardPunishment.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateRewardPunishment(id, payload) {
        await db.RewardPunishment.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteRewardPunishment(id) {
        await db.RewardPunishment.destroy({
            where: { id }
        });
    }

    async foundRewardPunishment(RewardPunishmentId, next) {
        const foundRewardPunishment = await this.findById(RewardPunishmentId);
        if (!foundRewardPunishment) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Reward or Punishment")));
        }
        return foundRewardPunishment;
    }
}

module.exports = new RewardPunishmentService;