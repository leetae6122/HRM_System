'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Attendance', [
            {
                id: 109,
                attendanceDate: '2023-12-11',
                inTime: '07:53:58',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 110,
                attendanceDate: '2023-12-11',
                inTime: '07:51:30',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 111,
                attendanceDate: '2023-12-11',
                inTime: '07:54:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 112,
                attendanceDate: '2023-12-11',
                inTime: '07:52:11',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 113,
                attendanceDate: '2023-12-11',
                inTime: '07:57:42',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 114,
                attendanceDate: '2023-12-11',
                inTime: '07:56:03',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 115,
                attendanceDate: '2023-12-11',
                inTime: '12:55:12',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 116,
                attendanceDate: '2023-12-11',
                inTime: '12:58:52',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 117,
                attendanceDate: '2023-12-11',
                inTime: '12:57:01',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 118,
                attendanceDate: '2023-12-11',
                inTime: '13:02:12',
                inStatus: 'Late In',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 119,
                attendanceDate: '2023-12-11',
                inTime: '12:57:40',
                inStatus: 'On Time',

                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 120,
                attendanceDate: '2023-12-11',
                inTime: '12:57:49',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 121,
                attendanceDate: '2023-12-12',
                inTime: '07:54:08',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 122,
                attendanceDate: '2023-12-12',
                inTime: '07:56:23',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 123,
                attendanceDate: '2023-12-12',
                inTime: '07:56:31',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 124,
                attendanceDate: '2023-12-12',
                inTime: '07:54:23',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 125,
                attendanceDate: '2023-12-12',
                inTime: '07:56:43',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 126,
                attendanceDate: '2023-12-12',
                inTime: '07:58:42',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 127,
                attendanceDate: '2023-12-12',
                inTime: '12:55:25',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 128,
                attendanceDate: '2023-12-12',
                inTime: '12:54:57',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 129,
                attendanceDate: '2023-12-12',
                inTime: '12:56:12',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 130,
                attendanceDate: '2023-12-12',
                inTime: '12:56:30',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 131,
                attendanceDate: '2023-12-12',
                inTime: '12:58:02',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 132,
                attendanceDate: '2023-12-12',
                inTime: '12:57:40',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 134,
                attendanceDate: '2023-12-13',
                inTime: '7:58:01',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 135,
                attendanceDate: '2023-12-13',
                inTime: '07:55:23',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 136,
                attendanceDate: '2023-12-13',
                inTime: '07:58:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 137,
                attendanceDate: '2023-12-13',
                inTime: '07:56:23',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 138,
                attendanceDate: '2023-12-13',
                inTime: '07:54:15',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 139,
                attendanceDate: '2023-12-13',
                inTime: '07:57:50',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 140,
                attendanceDate: '2023-12-13',
                inTime: '12:56:10',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 141,
                attendanceDate: '2023-12-13',
                inTime: '12:55:23',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 142,
                attendanceDate: '2023-12-13',
                inTime: '12:58:45',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 166,
                attendanceDate: '2023-12-13',
                inTime: '12:55:52',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 143,
                attendanceDate: '2023-12-13',
                inTime: '12:56:02',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 144,
                attendanceDate: '2023-12-13',
                inTime: '12:56:42',
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
