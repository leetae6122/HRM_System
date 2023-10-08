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
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: DataTypes.STRING,
        countryCode: DataTypes.INTEGER,
        isoCode: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Country'
    });

    return Country;
};