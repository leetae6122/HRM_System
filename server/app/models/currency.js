'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Currency.hasMany(models.Position, {foreignKey: 'currencyId'});
        Currency.hasMany(models.Salary, {foreignKey: 'currencyId'});
    }
  }
  Currency.init({   
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    symbol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Currency',
    tableName: 'currency'
  });

  return Currency;
};