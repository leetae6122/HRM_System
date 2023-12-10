'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Allowance', [
            {
                id: 1,
                title: 'Phụ cấp đi lại',
                amount: 200000,
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                employeeId: 'NV20230001',
                adminEId: 'NV20230001',
                createdAt: '2023-01-01 09:00:00',
                updatedAt: '2023-01-01 09:00:00'
            },
            {
                id: 2,
                title: 'Phụ cấp đi lại',
                amount: 200000,
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                employeeId: 'NV20230002',
                adminEId: 'NV20230001',
                createdAt: '2023-01-01 09:00:00',
                updatedAt: '2023-01-01 09:00:00'
            },
            {
                id: 3,
                title: 'Phụ cấp đi lại',
                amount: 200000,
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                employeeId: 'NV20230003',
                adminEId: 'NV20230001',
                createdAt: '2023-01-01 09:00:00',
                updatedAt: '2023-01-01 09:00:00'
            },
            {
                id: 4,
                title: 'Phụ cấp đi lại',
                amount: 200000,
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                employeeId: 'NV20230004',
                adminEId: 'NV20230001',
                createdAt: '2023-01-01 09:00:00',
                updatedAt: '2023-01-01 09:00:00'
            },
            {
                id: 5,
                title: 'Phụ cấp đi lại',
                amount: 200000,
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                employeeId: 'NV20230005',
                adminEId: 'NV20230001',
                createdAt: '2023-01-01 09:00:00',
                updatedAt: '2023-01-01 09:00:00'
            }
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Allowance', null, {});
    }
};
