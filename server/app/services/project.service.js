import { MSG_ERROR_NOT_FOUND } from "../utils/message.util";
import db from "./../models/index";
import createError from 'http-errors';

class ProjectService {
    async findById(id) {
        const result = await db.Project.findByPk(id, {
            raw: true,
            nest: true
        });
        return result;
    }

    async findAll() {
        const result = await db.Project.findAll({});
        return result;
    }

    async filterListProject(body) {
        const page = body.page || 1;
        const limit = body.size || 10;
        const where = body.where;
        const attributes = body.attributes;
        const order = body.order;

        const offset = (page - 1) * limit;

        const { count, rows } = await db.Project.findAndCountAll({
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

    async createProject(payload) {
        const result = await db.Project.create(
            payload,
            {
                raw: true,
                nest: true
            }
        );
        return result;
    }

    async updateProject(id, payload) {
        await db.Project.update(
            payload
            ,
            {
                where: { id },
            }
        );
    }

    async deleteProject(id) {
        await db.Project.destroy({
            where: { id }
        });
    }

    async foundProject(projectId, next) {
        const foundProject = await this.findById(projectId);
        if (!foundProject) {
            return next(createError.BadRequest(MSG_ERROR_NOT_FOUND("Project")));
        }
        return foundProject;
    }
}

module.exports = new ProjectService;