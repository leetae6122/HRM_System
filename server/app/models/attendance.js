'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(models.Project, { foreignKey: 'projectId', as: 'projectData' });
      Attendance.belongsTo(models.Task, { foreignKey: 'taskId', as: 'taskData' });
      Attendance.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Attendance.belongsTo(models.Employee, { foreignKey: 'handledBy', as: 'handlerData' });
    }
  }
  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    description: DataTypes.STRING,
    attendanceDate: DataTypes.DATEONLY,
    hourSpent: DataTypes.FLOAT,
    hourOT: DataTypes.FLOAT,
    status: DataTypes.ENUM('Pending', 'Reject', 'Approved'),
    place: DataTypes.ENUM('Office', 'At Home'),
    handledBy: DataTypes.UUID,
    employeeId: DataTypes.UUID,
    taskId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Attendance'
  });

  return Attendance;
};