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
    fromDate: DataTypes.DATEONLY,
    toDate: DataTypes.DATEONLY,
    employeeId: DataTypes.STRING,
    addedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wage'
  });

  return Wage;
};