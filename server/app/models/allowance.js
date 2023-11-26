'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allowance extends Model {
    static associate(models) {
      Allowance.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Allowance.belongsTo(models.Employee, { foreignKey: 'adminEId', as: 'adderData' });
    }
  }
  Allowance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    employeeId: DataTypes.STRING,
    adminEId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allowance'
  });

  return Allowance;
};