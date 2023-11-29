'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Leave', [{
            id: 1,
            title: 'Nghỉ bệnh',
            description: 'Xin phép nghỉ bệnh. Lý do sốt cao',
            status: 'Approved',
            leaveFrom: '2023-11-16',
            leaveTo: '2023-11-16',
            employeeId: 'NV20230002',
            adminEId: 'NV20230001',
            createdAt: '2023-11-15 22:20:00',
            updatedAt: '2023-11-16 08:10:00'
        },
        {
            id: 2,
            title: 'Phép nghỉ của tháng',
            description: 'Xin phép nghỉ của số phép tháng. Lý do: đi nghỉ dưỡng. Công việc được giao đã hoàn thành trước khi nghỉ phép',
            status: 'Approved',
            leaveFrom: '2023-11-23',
            leaveTo: '2023-11-24',
            employeeId: 'NV20230003',
            adminEId: 'NV20230001',
            createdAt: '2023-11-18 15:30:00',
            updatedAt: '2023-11-19 08:20:00'
        },
        {
            id: 3,
            title: 'Khám bệnh',
            description: 'Xin nghỉ phép để đi khám bệnh',
            status: 'Approved',
            leaveFrom: '2023-11-22',
            leaveTo: '2023-11-22',
            employeeId: 'NV20230001',
            adminEId: 'NV20230001',
            createdAt: '2023-11-19 18:50:00',
            updatedAt: '2023-11-20 08:05:00'
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Leave', null, {});
    }
};
