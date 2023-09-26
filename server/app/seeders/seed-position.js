'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Position', [{
            id: 1,
            name: 'Office Admin',
            minSalary: 800,
            maxSalary: 2000,
            currencyId: 1,
        },
        {
            id: 2,
            name: 'Developer - Intern',
            minSalary: 100,
            currencyId: 1,
        },
        {
            id: 3,
            name: 'Developer - Junior',
            minSalary: 1000,
            maxSalary: 2500,
            currencyId: 1,
        },
        {
            id: 4,
            name: 'Business Analyst - Intern',
            minSalary: 100,
            currencyId: 1,
        },
        {
            id: 5,
            name: 'Business Analyst - Junior',
            minSalary: 500,
            maxSalary: 2000,
            currencyId: 1,
        },
        {
            id: 6,
            name: 'Mobile Developer - Intern',
            minSalary: 100,
            currencyId: 1,
        },
        {
            id: 7,
            name: 'Mobile Developer - Junior',
            minSalary: 800,
            maxSalary: 2400,
            currencyId: 1,
        },
        {
            id: 8,
            name: 'Quality Assurance - Intern',
            minSalary: 100,
            currencyId: 1,
        },
        {
            id: 9,
            name: 'Quality Assurance - Junior',
            minSalary: 800,
            maxSalary: 2200,
            currencyId: 1,
        },
    ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Position', null, {});
    }
};
