'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Position', [{
            id: 1,
            name: 'Quản trị hệ thống',
            minHourlyWage: 100000,
            maxHourlyWage: 200000,
            departmentId: 2,
        },
        {
            id: 2,
            name: 'Trưởng phòng Marketing',
            minHourlyWage: 100000,
            maxHourlyWage: 220000,
            departmentId: 1,
        },
        {
            id: 3,
            name: 'Chuyên viên Content Marketing',
            minHourlyWage: 60000,
            maxHourlyWage: 165000,
            departmentId: 1,
        },
        {
            id: 4,
            name: 'Chuyên viên Technical Marketing',
            minHourlyWage: 50000,
            maxHourlyWage: 160000,
            departmentId: 1,
        },
        {
            id: 5,
            name: 'Thực tập sinh - Marketing',
            minHourlyWage: 10000,
            maxHourlyWage: 20000,
            departmentId: 1,
        },
        {
            id: 6,
            name: 'Trưởng phòng Nhân sự',
            minHourlyWage: 100000,
            maxHourlyWage: 230000,
            departmentId: 2,
        },
        {
            id: 7,
            name: 'Chuyên viên Truyền thông',
            minHourlyWage: 60000,
            maxHourlyWage: 160000,
            departmentId: 2,
        },
        {
            id: 8,
            name: 'Chuyên viên Tuyển dụng',
            minHourlyWage: 60000,
            maxHourlyWage: 160000,
            departmentId: 2,
        },
        {
            id: 9,
            name: 'Chuyên viên Hành chính',
            minHourlyWage: 60000,
            maxHourlyWage: 160000,
            departmentId: 2,
        },
        {
            id: 10,
            name: 'Thực tập sinh - Hành chính Nhân sự',
            minHourlyWage: 10000,
            maxHourlyWage: 20000,
            departmentId: 2,
        },
        {
            id: 11,
            name: 'Trưởng phòng Kinh doanh',
            minHourlyWage: 100000,
            maxHourlyWage: 230000,
            departmentId: 3,
        },
        {
            id: 12,
            name: 'Chuyên viên Tư vấn',
            minHourlyWage: 60000,
            maxHourlyWage: 160000,
            departmentId: 3,
        },
        {
            id: 13,
            name: 'Chuyên viên Kinh doanh',
            minHourlyWage: 60000,
            maxHourlyWage: 160000,
            departmentId: 3,
        },
        {
            id: 14,
            name: 'Trưởng phòng IT',
            minHourlyWage: 120000,
            maxHourlyWage: 250000,
            departmentId: 4,
        },
        {
            id: 15,
            name: 'Chuyên viên Lập trình',
            minHourlyWage: 70000,
            maxHourlyWage: 180000,
            departmentId: 4,
        },
        {
            id: 16,
            name: 'Chuyên viên Kiểm thử phần mềm',
            minHourlyWage: 60000,
            maxHourlyWage: 167000,
            departmentId: 4,
        },
        {
            id: 17,
            name: 'Thực tập sinh - Kiểm thử phần mềm',
            minHourlyWage: 10000,
            maxHourlyWage: 20000,
            departmentId: 4,
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Position', null, {});
    }
};
