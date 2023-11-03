'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Position', [{
            id: 1,
            name: 'HR Admin',
            minHourlySalary: 100000,
            maxHourlySalary: 200000,
        },
        {
            id: 2,
            name: 'Developer - Intern',
            minHourlySalary: 10000,
            maxHourlySalary: 20000,
        },
        {
            id: 3,
            name: 'Developer - Junior',
            minHourlySalary: 65000,
            maxHourlySalary: 145000,
        },
        {
            id: 4,
            name: 'Developer - Senior',
            minHourlySalary: 125000,
            maxHourlySalary: 230000,
        },
        {
            id: 5,
            name: 'Business Analyst - Intern',
            minHourlySalary: 10000,
            maxHourlySalary: 20000,
        },
        {
            id: 6,
            name: 'Business Analyst - Junior',
            minHourlySalary: 60000,
            maxHourlySalary: 140000,
        },
        {
            id: 7,
            name: 'Business Analyst - Senior',
            minHourlySalary: 120000,
            maxHourlySalary: 220000,
        },
        {
            id: 8,
            name: 'QA / QC - Intern',
            minHourlySalary: 10000,
            maxHourlySalary: 20000,
        },
        {
            id: 9,
            name: 'QA / QC - Junior',
            minHourlySalary: 65000,
            maxHourlySalary: 145000,
        },
        {
            id: 10,
            name: 'QA / QC - Senior',
            minHourlySalary: 120000,
            maxHourlySalary: 225000,
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Position', null, {});
    }
};
