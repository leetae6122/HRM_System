'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Attendance', [
            {
                id: 1,
                attendanceDate: '2023-11-28',
                inTime: '07:53:08',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 2,
                attendanceDate: '2023-11-28',
                inTime: '07:59:30',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 3,
                attendanceDate: '2023-11-28',
                inTime: '07:58:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 4,
                attendanceDate: '2023-11-28',
                inTime: '07:57:03',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 5,
                attendanceDate: '2023-11-28',
                inTime: '07:56:11',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 6,
                attendanceDate: '2023-11-28',
                inTime: '08:01:11',
                inStatus: 'Late In',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 7,
                attendanceDate: '2023-11-28',
                inTime: '12:59:12',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 8,
                attendanceDate: '2023-11-28',
                inTime: '12:59:01',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 9,
                attendanceDate: '2023-11-28',
                inTime: '13:02:12',
                inStatus: 'Late In',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 10,
                attendanceDate: '2023-11-28',
                inTime: '12:57:52',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 11,
                attendanceDate: '2023-11-28',
                inTime: '13:01:09',
                inStatus: 'Late In',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 12,
                attendanceDate: '2023-11-28',
                inTime: '12:56:40',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Attendance', null, {});
    }
};
