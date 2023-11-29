'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Position.hasMany(models.Employee, { foreignKey: 'positionId' });
      Position.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'departmentData' });
    }
  }
  Position.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    minHourlyWage: DataTypes.FLOAT,
    maxHourlyWage: DataTypes.FLOAT,
    departmentId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Position'
  });

  return Position;
};