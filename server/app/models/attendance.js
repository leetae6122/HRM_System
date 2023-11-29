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
      Attendance.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Attendance.belongsTo(models.Employee, { foreignKey: 'adminEId', as: 'adminData' });
      Attendance.belongsTo(models.Employee, { foreignKey: 'managerEId', as: 'managerData' });
      Attendance.belongsTo(models.Shift, { foreignKey: 'shiftId', as: 'shiftData' });
    }
  }
  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    attendanceDate: DataTypes.DATEONLY,
    inTime:  DataTypes.TIME,
    outTime: DataTypes.TIME,
    totalHours: DataTypes.FLOAT,
    inStatus: DataTypes.ENUM('Late In', 'On Time'),
    outStatus: DataTypes.ENUM('Out Early', 'On Time'),
    managerStatus: DataTypes.ENUM('Pending', 'Reject', 'Approved'),
    adminStatus: DataTypes.ENUM('Pending', 'Reject', 'Approved'),
    shiftId: DataTypes.INTEGER,
    adminEId: DataTypes.STRING,
    managerEId: DataTypes.STRING,
    employeeId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Attendance'
  });

  return Attendance;
};