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
      // Location.hasMany(models.Department, { foreignKey: 'locationId', as: 'locationData' });
      // Location.belongsTo(models.Country, { foreignKey: 'countryId', as: 'countryData' });
    }
  }
  Attendance.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    attendanceDate: DataTypes.DATE,
    hourSpent: DataTypes.DATE,
    employeeId: DataTypes.UUID,
    // taskId:  DataTypes.UUID,
    // projectId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendance'
  });

  return Attendance;
};