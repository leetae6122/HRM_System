'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Wage', [{
            id: 1,
            basicHourlyWage: 150000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230001',
            adminEId: 'NV20230001',
        },
        {
            id: 2,
            basicHourlyWage: 10000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230002',
            adminEId: 'NV20230001',
        },
        {
            id: 3,
            basicHourlyWage: 10000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230003',
            adminEId: 'NV20230001',
        }
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Wage', null, {});
    }
};
