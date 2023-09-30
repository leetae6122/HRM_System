'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Project extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Project.init({
        title: DataTypes.STRING,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        status: DataTypes.INTEGER,
        managerId: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'Project',
        tableName: 'project'
    });

    return Project;
};