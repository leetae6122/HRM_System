'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wage extends Model {
    static associate(models) {
      Wage.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employeeData' });
      Wage.belongsTo(models.Employee, { foreignKey: 'adminEId', as: 'adderData' });
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
    adminEId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wage'
  });

  return Wage;
};