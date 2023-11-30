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
            {
                id: 13,
                attendanceDate: '2023-11-29',
                inTime: '08:01:08',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 14,
                attendanceDate: '2023-11-29',
                inTime: '07:58:43',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 15,
                attendanceDate: '2023-11-29',
                inTime: '07:55:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 16,
                attendanceDate: '2023-11-29',
                inTime: '07:58:03',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 17,
                attendanceDate: '2023-11-29',
                inTime: '07:57:23',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 18,
                attendanceDate: '2023-11-29',
                inTime: '07:59:11',
                inStatus: 'Late In',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 19,
                attendanceDate: '2023-11-29',
                inTime: '12:58:25',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 20,
                attendanceDate: '2023-11-29',
                inTime: '12:57:57',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 21,
                attendanceDate: '2023-11-29',
                inTime: '12:58:12',
                inStatus: 'Late In',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 22,
                attendanceDate: '2023-11-29',
                inTime: '13:01:52',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 23,
                attendanceDate: '2023-11-29',
                inTime: '12:58:02',
                inStatus: 'Late In',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 24,
                attendanceDate: '2023-11-29',
                inTime: '12:57:40',
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
