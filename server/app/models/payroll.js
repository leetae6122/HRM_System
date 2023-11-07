'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payroll.belongsTo(models.Wage, { foreignKey: 'wageId', as: 'wageData' });
      Payroll.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Payroll.belongsTo(models.Employee, { foreignKey: 'handledBy', as: 'handlerData' });
    }
  }
  Payroll.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    month: DataTypes.DATEONLY,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    hoursWorked: DataTypes.FLOAT,
    hoursOvertime: DataTypes.FLOAT,
    totalBasicWage: DataTypes.FLOAT,
    totalOvertimeWage: DataTypes.FLOAT,
    totalAllowance: DataTypes.FLOAT,
    deduction: DataTypes.FLOAT,
    totalPaid: DataTypes.FLOAT,
    payDate: DataTypes.DATEONLY,
    status: DataTypes.ENUM('Pending', 'Paid'),
    employeeId: DataTypes.STRING,
    handledBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payroll'
  });

  return Payroll;
};