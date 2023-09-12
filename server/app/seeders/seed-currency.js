'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Currency', [{
            id: 1,
            name: 'Dollars',
            code: 'USD',
            symbol: '$'
        },
        {
            id: 2,
            name: 'Dong',
            code: 'VND',
            symbol: 'đ'
        },
        {
            id: 3,
            name: 'Euro',
            code: 'EUR',
            symbol: '€'
        },
        {
            id: 4,
            name: 'Yuan Renminbi',
            code: 'CNY',
            symbol: '¥'
        },
        {
            id: 5,
            name: 'Rupees',
            code: 'INR',
            symbol: '₹'
        },
        {
            id: 6,
            name: 'Yen',
            code: 'JPY',
            symbol: '¥'
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Currency', null, {});
    }
};
