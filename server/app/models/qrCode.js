'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QRCode extends Model {
    static associate(models) {
    }
  }
  QRCode.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    hashQRCodeToken: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'QRCode'
  });

  return QRCode;
};