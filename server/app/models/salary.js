'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    static associate(models) {
      Salary.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Salary.belongsTo(models.Employee, { foreignKey: 'addedBy', as: 'adderData' });
      Salary.hasMany(models.Payroll, { foreignKey: 'salaryId', as: 'salaryData' });
    }
  }
  Salary.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    basicHourlySalary: DataTypes.FLOAT,
    hourlyOvertimeSalary: DataTypes.FLOAT,
    isApplying: DataTypes.BOOLEAN,
    employeeId: DataTypes.UUID,
    addedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Salary'
  });

  return Salary;
};