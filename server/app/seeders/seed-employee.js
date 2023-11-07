'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Employee', [{
            id: 'NV20230001',
            firstName: 'Trí',
            lastName: 'Lê Dương',
            email: 'trild@gmail.com',
            phoneNumber: '0924655433',
            gender: true,
            dateBirth: '1988-08-19',
            citizenshipId: '035301001476',
            dateHired: '2020-01-22',
            avatarUrl: null,
            address: 'Thủ Đức, HCM',
            positionId: 1,
            departmentId: 1,
        },
        {
            id: 'NV20230002',
            firstName: 'Trung',
            lastName: 'Đinh Quốc',
            email: 'trungdq@gmai.com',
            phoneNumber: '0924655439',
            gender: true,
            dateBirth: '1999-06-29',
            citizenshipId: '012305062009',
            dateHired: '2020-01-27',
            avatarUrl: null,
            address: 'Thanh Xuân, Hà Nội',
            positionId: 2,
            departmentId: 4
        },
        {
            id: 'NV20230003',
            firstName: 'Hạnh',
            lastName: 'Đào Minh',
            email: 'hanhmd@gmail.com',
            phoneNumber: '0941688538',
            gender: false,
            dateBirth: '1997-11-15',
            citizenshipId:'035301001466',
            dateHired: '2021-09-16',
            avatarUrl: null,
            address: 'Hoàn Kiếm, Hà Nội',
            positionId: 3,
            departmentId: 4
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Employee', null, {});
    }
};
