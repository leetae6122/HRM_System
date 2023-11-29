'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Employee, { foreignKey: 'departmentId', as: 'employeeData' });
      Department.hasMany(models.Position, { foreignKey: 'departmentId', as: 'positionData'  });
      Department.belongsTo(models.Employee, { foreignKey: 'managerEId', as: 'managerData' });
    }
  }
  Department.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    managerEId: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Department'
  });

  return Department;
};