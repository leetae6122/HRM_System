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
    }
  }
  Salary.init({
    basicSalary: DataTypes.FLOAT,
    allowance: DataTypes.FLOAT,
    totalSalary: DataTypes.FLOAT,
    currencyId: DataTypes.INTEGER,
    employeeId: DataTypes.UUID,
    addedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Salary',
    tableName: 'salary'
  });

  return Salary;
};