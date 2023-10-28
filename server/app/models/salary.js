'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Salary.belongsTo(models.Currency, { foreignKey: 'currencyId', as: 'currencyData' });
      Salary.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Salary.belongsTo(models.Employee, { foreignKey: 'addedBy', as: 'adderData' });
      Salary.hasMany(models.Payroll, { foreignKey: 'payrollId', as: 'payrollData' });
    }
  }
  Salary.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    basicHourlySalary: DataTypes.FLOAT,
    hourlyOvertimeSalary: DataTypes.FLOAT,
    allowance: DataTypes.FLOAT,
    currencyId: DataTypes.INTEGER,
    employeeId: DataTypes.UUID,
    addedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Salary'
  });

  return Salary;
};