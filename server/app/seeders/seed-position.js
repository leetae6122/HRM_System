'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Position', [{
            id: 1,
            name: 'HR Admin',
            minHourlyWage: 100000,
            maxHourlyWage: 200000,
        },
        {
            id: 2,
            name: 'Developer - Intern',
            minHourlyWage: 10000,
            maxHourlyWage: 20000,
        },
        {
            id: 3,
            name: 'Developer - Junior',
            minHourlyWage: 65000,
            maxHourlyWage: 145000,
        },
        {
            id: 4,
            name: 'Developer - Senior',
            minHourlyWage: 125000,
            maxHourlyWage: 230000,
        },
        {
            id: 5,
            name: 'Business Analyst - Intern',
            minHourlyWage: 10000,
            maxHourlyWage: 20000,
        },
        {
            id: 6,
            name: 'Business Analyst - Junior',
            minHourlyWage: 60000,
            maxHourlyWage: 140000,
        },
        {
            id: 7,
            name: 'Business Analyst - Senior',
            minHourlyWage: 120000,
            maxHourlyWage: 220000,
        },
        {
            id: 8,
            name: 'QA / QC - Intern',
            minHourlyWage: 10000,
            maxHourlyWage: 20000,
        },
        {
            id: 9,
            name: 'QA / QC - Junior',
            minHourlyWage: 65000,
            maxHourlyWage: 145000,
        },
        {
            id: 10,
            name: 'QA / QC - Senior',
            minHourlyWage: 120000,
            maxHourlyWage: 225000,
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Position', null, {});
    }
};
