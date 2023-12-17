'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('RewardPunishment', [
            {
                id: 1,
                type: 'Punishment',
                reason: 'Phạt đi trễ trên 2 lần của tháng 11/2023',
                amount: 200000,
                date: '2023-11-30',
                employeeId: 'NV20230003',
                adminEId: 'NV20230001',
                createdAt: '2023-11-30 14:00:00',
                updatedAt: '2023-11-30 14:00:00'
            },
            {
                id: 2,
                type: 'Reward',
                reason: 'Tiền thưởng giới thiệu nhân sự mới vào công ty',
                amount: 1000000,
                date: '2023-12-01',
                employeeId: 'NV20230002',
                adminEId: 'NV20230001',
                createdAt: '2023-12-01 09:00:00',
                updatedAt: '2023-12-01 09:00:00'
            },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('RewardPunishment', null, {});
    }
};
