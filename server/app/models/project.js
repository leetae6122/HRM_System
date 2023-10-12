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
            Project.hasMany(models.Attendance, { foreignKey: 'projectId', as: 'projectData' });
        }
    }
    Project.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: DataTypes.STRING,
        summary: DataTypes.STRING,
        details: DataTypes.TEXT,
        startDate: DataTypes.DATEONLY,
        endDate: DataTypes.DATEONLY,
        status: DataTypes.ENUM('Upcoming', 'Running', 'Complete'),
        managerId: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'Project'
    });

    return Project;
};