'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wage extends Model {
    static associate(models) {
      Wage.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Wage.belongsTo(models.Employee, { foreignKey: 'addedBy', as: 'adderData' });
      Wage.hasMany(models.Payroll, { foreignKey: 'wageId', as: 'wageData' });
    }
  }
  Wage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    basicHourlyWage: DataTypes.FLOAT,
    hourlyOvertimePay: DataTypes.FLOAT,
    isApplying: DataTypes.BOOLEAN,
    employeeId: DataTypes.UUID,
    addedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Wage'
  });

  return Wage;
};