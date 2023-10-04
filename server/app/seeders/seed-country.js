'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Country', [{
            id: 1,
            name: 'Canada',
            countryCode: 1,
            isoCode: 'CA / CAN'
        },
        {
            id: 2,
            name: 'United States',
            countryCode: 1,
            isoCode: 'US / USA'
        },
        {
            id: 3,
            name: 'Australia',
            countryCode: 61,
            isoCode: 'AU / AUS'
        },
        {
            id: 4,
            name: 'Japan',
            countryCode: 81,
            isoCode: 'JP / JPN'
        },
        {
            id: 5,
            name: 'Vietnam',
            countryCode: 84,
            isoCode: 'VN / VNM'
        },
        {
            id: 6,
            name: 'China',
            countryCode: 86,
            isoCode: 'CN / CHN'
        },
        {
            id: 7,
            name: 'India',
            countryCode: 91,
            isoCode: 'IN / IND'
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Country', null, {});
    }
};
