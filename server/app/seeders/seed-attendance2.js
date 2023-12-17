'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Attendance', [
            {
                id: 37,
                attendanceDate: '2023-12-01',
                inTime: '07:54:08',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 38,
                attendanceDate: '2023-12-01',
                inTime: '07:57:53',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 39,
                attendanceDate: '2023-12-01',
                inTime: '07:57:32',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 40,
                attendanceDate: '2023-12-01',
                inTime: '07:58:21',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 41,
                attendanceDate: '2023-12-01',
                inTime: '07:54:24',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 42,
                attendanceDate: '2023-12-01',
                inTime: '07:53:32',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 43,
                attendanceDate: '2023-12-01',
                inTime: '12:54:12',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 44,
                attendanceDate: '2023-12-01',
                inTime: '12:58:01',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 45,
                attendanceDate: '2023-12-01',
                inTime: '12:57:22',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 46,
                attendanceDate: '2023-12-01',
                inTime: '12:57:42',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 47,
                attendanceDate: '2023-12-01',
                inTime: '12:56:29',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 48,
                attendanceDate: '2023-12-01',
                inTime: '12:57:40',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 49,
                attendanceDate: '2023-12-04',
                inTime: '07:55:48',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 50,
                attendanceDate: '2023-12-04',
                inTime: '07:57:49',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 51,
                attendanceDate: '2023-12-04',
                inTime: '07:58:02',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 52,
                attendanceDate: '2023-12-04',
                inTime: '07:56:54',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 53,
                attendanceDate: '2023-12-04',
                inTime: '07:57:11',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 54,
                attendanceDate: '2023-12-04',
                inTime: '07:58:03',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 55,
                attendanceDate: '2023-12-04',
                inTime: '12:56:22',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 56,
                attendanceDate: '2023-12-04',
                inTime: '12:57:42',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 57,
                attendanceDate: '2023-12-04',
                inTime: '12:55:21',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 58,
                attendanceDate: '2023-12-04',
                inTime: '12:56:42',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 59,
                attendanceDate: '2023-12-04',
                inTime: '12:56:40',
                inStatus: 'On Time',

                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 60,
                attendanceDate: '2023-12-04',
                inTime: '12:54:45',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 61,
                attendanceDate: '2023-12-05',
                inTime: '07:55:08',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 62,
                attendanceDate: '2023-12-05',
                inTime: '07:55:24',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 63,
                attendanceDate: '2023-12-05',
                inTime: '07:57:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 64,
                attendanceDate: '2023-12-05',
                inTime: '07:56:43',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 65,
                attendanceDate: '2023-12-05',
                inTime: '07:55:56',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 66,
                attendanceDate: '2023-12-05',
                inTime: '07:55:42',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 67,
                attendanceDate: '2023-12-05',
                inTime: '12:58:24',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 68,
                attendanceDate: '2023-12-05',
                inTime: '12:54:51',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 69,
                attendanceDate: '2023-12-05',
                inTime: '12:52:52',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 70,
                attendanceDate: '2023-12-05',
                inTime: '12:57:52',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 71,
                attendanceDate: '2023-12-05',
                inTime: '12:56:34',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 72,
                attendanceDate: '2023-12-05',
                inTime: '12:57:40',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 73,
                attendanceDate: '2023-12-06',
                inTime: '07:54:28',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 74,
                attendanceDate: '2023-12-06',
                inTime: '07:54:43',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 75,
                attendanceDate: '2023-12-06',
                inTime: '07:57:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 76,
                attendanceDate: '2023-12-06',
                inTime: '07:56:03',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 77,
                attendanceDate: '2023-12-06',
                inTime: '07:57:23',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 78,
                attendanceDate: '2023-12-06',
                inTime: '07:57:11',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 79,
                attendanceDate: '2023-12-06',
                inTime: '12:58:25',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 80,
                attendanceDate: '2023-12-06',
                inTime: '12:57:57',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 81,
                attendanceDate: '2023-12-06',
                inTime: '12:58:25',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 82,
                attendanceDate: '2023-12-06',
                inTime: '12:56:23',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 83,
                attendanceDate: '2023-12-06',
                inTime: '12:58:02',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 84,
                attendanceDate: '2023-12-06',
                inTime: '12:57:40',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 85,
                attendanceDate: '2023-12-07',
                inTime: '7:58:01',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 86,
                attendanceDate: '2023-12-07',
                inTime: '07:55:23',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 87,
                attendanceDate: '2023-12-07',
                inTime: '07:58:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 88,
                attendanceDate: '2023-12-07',
                inTime: '07:56:53',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 89,
                attendanceDate: '2023-12-07',
                inTime: '07:54:15',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 90,
                attendanceDate: '2023-12-07',
                inTime: '07:54:50',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 91,
                attendanceDate: '2023-12-07',
                inTime: '12:54:10',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 92,
                attendanceDate: '2023-12-07',
                inTime: '12:54:23',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 93,
                attendanceDate: '2023-12-07',
                inTime: '12:56:32',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 94,
                attendanceDate: '2023-12-07',
                inTime: '12:55:52',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 95,
                attendanceDate: '2023-12-07',
                inTime: '12:56:02',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 96,
                attendanceDate: '2023-12-07',
                inTime: '12:56:42',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 2
            },
            {
                id: 97,
                attendanceDate: '2023-12-08',
                inTime: '07:53:08',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 1
            },
            {
                id: 98,
                attendanceDate: '2023-12-08',
                inTime: '07:57:03',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 1
            },
            {
                id: 99,
                attendanceDate: '2023-12-08',
                inTime: '07:58:33',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 1
            },
            {
                id: 100,
                attendanceDate: '2023-12-08',
                inTime: '08:01:11',
                inStatus: 'Late In',
                employeeId: 'NV20230004',
                shiftId: 1
            },
            {
                id: 101,
                attendanceDate: '2023-12-08',
                inTime: '07:57:11',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 1
            },
            {
                id: 102,
                attendanceDate: '2023-12-08',
                inTime: '07:52:30',
                inStatus: 'On Time',
                employeeId: 'NV20230006',
                shiftId: 1
            },
            {
                id: 103,
                attendanceDate: '2023-12-08',
                inTime: '12:57:12',
                inStatus: 'On Time',
                employeeId: 'NV20230001',
                shiftId: 2
            },
            {
                id: 104,
                attendanceDate: '2023-12-08',
                inTime: '12:54:01',
                inStatus: 'On Time',
                employeeId: 'NV20230002',
                shiftId: 2
            },
            {
                id: 105,
                attendanceDate: '2023-12-08',
                inTime: '12:57:52',
                inStatus: 'On Time',
                employeeId: 'NV20230003',
                shiftId: 2
            },
            {
                id: 106,
                attendanceDate: '2023-12-08',
                inTime: '12:56:42',
                inStatus: 'On Time',
                employeeId: 'NV20230004',
                shiftId: 2
            },
            {
                id: 107,
                attendanceDate: '2023-12-08',
                inTime: '12:58:21',
                inStatus: 'On Time',
                employeeId: 'NV20230005',
                shiftId: 2
            },
            {
                id: 108,
                attendanceDate: '2023-12-08',
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
