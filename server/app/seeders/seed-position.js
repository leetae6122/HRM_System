'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Position', [{
            id: 1,
            name: 'Office Admin',
            minHourlySalary: 100000,
            maxHourlySalary: 200000,
            currencyId: 2,
        },
        {
            id: 2,
            name: 'Developer - Intern',
            minHourlySalary: 10000,
            maxHourlySalary: 20000,
            currencyId: 2,
        },
        {
            id: 3,
            name: 'Developer - Junior',
            minHourlySalary: 65000,
            maxHourlySalary: 145000,
            currencyId: 2,
        },
        {
            id: 4,
            name: 'Developer - Senior',
            minHourlySalary: 125000,
            maxHourlySalary: 230000,
            currencyId: 2,
        },
        {
            id: 5,
            name: 'Business Analyst - Intern',
            minHourlySalary: 10000,
            maxHourlySalary: 20000,
            currencyId: 2,
        },
        {
            id: 6,
            name: 'Business Analyst - Junior',
            minHourlySalary: 60000,
            maxHourlySalary: 140000,
            currencyId: 2,
        },
        {
            id: 7,
            name: 'Business Analyst - Senior',
            minHourlySalary: 120000,
            maxHourlySalary: 220000,
            currencyId: 2,
        },
        {
            id: 8,
            name: 'Quality Assurance - Intern',
            minHourlySalary: 10000,
            maxHourlySalary: 20000,
            currencyId: 2,
        },
        {
            id: 9,
            name: 'Quality Assurance - Junior',
            minHourlySalary: 65000,
            maxHourlySalary: 145000,
            currencyId: 2,
        },
        {
            id: 10,
            name: 'Quality Assurance - Senior',
            minHourlySalary: 120000,
            maxHourlySalary: 225000,
            currencyId: 2,
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Position', null, {});
    }
};
