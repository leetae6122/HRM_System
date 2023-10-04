'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Country extends Model {
        static associate(models) {
            Country.hasMany(models.Office, { foreignKey: 'countryId', as: 'countryData' });
        }
    }
    Country.init({
        name: DataTypes.STRING,
        countryCode: DataTypes.STRING,
        isoCode: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Country',
        tableName: 'country'
    });

    return Country;
};