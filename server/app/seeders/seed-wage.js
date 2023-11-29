'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Wage', [{
            id: 1,
            basicHourlyWage: 120000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230001',
            adminEId: 'NV20230001',
        },
        {
            id: 2,
            basicHourlyWage: 120000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230002',
            adminEId: 'NV20230001',
        },
        {
            id: 3,
            basicHourlyWage: 100000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230003',
            adminEId: 'NV20230001',
        },
        {
            id: 4,
            basicHourlyWage: 17000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230004',
            adminEId: 'NV20230001',
        },
        {
            id: 5,
            basicHourlyWage: 86000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230005',
            adminEId: 'NV20230001',
        },
        {
            id: 6,
            basicHourlyWage: 86000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230006',
            adminEId: 'NV20230001',
        },
        {
            id: 7,
            basicHourlyWage: 100000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230007',
            adminEId: 'NV20230001',
        },
        {
            id: 8,
            basicHourlyWage: 86000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230008',
            adminEId: 'NV20230001',
        },
        {
            id: 9,
            basicHourlyWage: 86000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230009',
            adminEId: 'NV20230001',
        },
        {
            id: 10,
            basicHourlyWage: 86000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230010',
            adminEId: 'NV20230001',
        },
        {
            id: 11,
            basicHourlyWage: 97000,
            fromDate: '2023-11-01',
            employeeId: 'NV20230011',
            adminEId: 'NV20230001',
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Wage', null, {});
    }
};
