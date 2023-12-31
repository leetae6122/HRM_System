'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Employee', [
            {
                id: 'NV20230001',
                firstName: 'Trí',
                lastName: 'Lê Dương',
                email: 'trild@gmail.com',
                phoneNumber: '0924655409',
                gender: true,
                dateBirth: '1996-08-19',
                citizenshipId: '035301001450',
                dateHired: '2020-01-22',
                avatarUrl: null,
                address: 'Ninh Kiều, Cần Thơ',
                positionId: 1,
                departmentId: 2,
            },
            {
                id: 'NV20230002',
                firstName: 'Anh',
                lastName: 'Nguyễn Diệp',
                gender: false,
                dateBirth: '1999-06-10',
                phoneNumber: '0924608193',
                email: 'anhnd@gmail.com',
                dateHired: '2022-02-04',
                address: 'Ô Môn, Cần Thơ',
                citizenshipId: '035301001459',
                positionId: 2,
                departmentId: 1,
                avatarUrl: null,
            },
            {
                id: 'NV20230003',
                firstName: 'Anh',
                lastName: 'Trần Nam',
                gender: true,
                dateBirth: '1994-09-11',
                phoneNumber: '0962342550',
                email: 'anhtn@gmail.com',
                dateHired: '2020-12-03',
                address: 'Ô môn, Cần Thơ',
                citizenshipId: '035301001460',
                positionId: 3,
                departmentId: 1,
                avatarUrl: null,
            },
            {
                id: 'NV20230004',
                firstName: 'Bách',
                lastName: 'Hoàng Ngọc',
                gender: true,
                dateBirth: '2001-08-12',
                phoneNumber: '0834082001',
                email: 'bachhn@gmail.com',
                dateHired: '2022-06-16',
                address: 'Cái Răng, Cần Thơ',
                citizenshipId: '035301001461',
                positionId: 5,
                departmentId: 1,
                avatarUrl: null,
            },
            {
                id: 'NV20230005',
                firstName: 'Dung',
                lastName: 'Nguyễn Thị Kim',
                gender: false,
                dateBirth: '1999-06-14',
                phoneNumber: '0163533789',
                email: 'dungntk@gmail.com',
                dateHired: '2021-11-27',
                address: 'Ninh Kiều, Cần Thơ',
                citizenshipId: '035301001462',
                positionId: 4,
                departmentId: 1,
                avatarUrl: null,
            },
            {
                id: 'NV20230006',
                firstName: 'Đăng',
                lastName: 'Phạm Hồng',
                gender: true,
                dateBirth: '1998-05-13',
                phoneNumber: '0984476509',
                email: 'dangph@gmail.com',
                dateHired: '2022-03-11',
                address: 'Cái Răng, Cần Thơ',
                citizenshipId: '035301001463',
                positionId: 3,
                departmentId: 1,
                avatarUrl: null,
            },
            {
                id: 'NV20230007',
                firstName: 'Hà',
                lastName: 'Trần Ngọc',
                gender: false,
                dateBirth: '1996-04-16',
                phoneNumber: '0924655434',
                email: 'hatn@gmai.com',
                dateHired: '2022-05-14',
                address: 'Ninh Kiều, Cần Thơ',
                citizenshipId: '035301001465',
                positionId: 6,
                departmentId: 2,
                avatarUrl: null,
            },
            {
                id: 'NV20230008',
                firstName: 'Hạnh',
                lastName: 'Đào Minh',
                gender: false,
                dateBirth: '1997-11-15',
                phoneNumber: '0941688538',
                email: 'hanhdm@gmail.com',
                dateHired: '2021-09-16',
                address: 'Thốt Nốt, Cần Thơ',
                citizenshipId: '035301001466',
                positionId: 7,
                departmentId: 2,
                avatarUrl: null,
            },
            {
                id: 'NV20230009',
                firstName: 'Hưng',
                lastName: 'Đỗ Quốc',
                gender: true,
                dateBirth: '2000-06-17',
                phoneNumber: '0162765429',
                email: 'hungqd@gmail.com',
                dateHired: '2021-11-11',
                address: 'Thốt Nốt, Cần Thơ',
                citizenshipId: '035301001467',
                positionId: 8,
                departmentId: 2,
                avatarUrl: null,
            },
            {
                id: 'NV20230010',
                firstName: 'Liên',
                lastName: 'Lê Phương',
                gender: false,
                dateBirth: '2000-07-11',
                phoneNumber: '0924655435',
                email: 'lienlp@gmai.com',
                dateHired: '2021-11-12',
                address: 'Ninh Kiều, Cần Thơ',
                citizenshipId: '035301001468',
                positionId: 10,
                departmentId: 2,
                avatarUrl: null,
            },
            {
                id: 'NV20230011',
                firstName: 'Mai',
                lastName: 'Nguyễn Anh',
                gender: false,
                dateBirth: '1994-08-04',
                phoneNumber: '0924655437',
                email: 'maina@gmail.com',
                dateHired: '2021-11-13',
                address: 'Ô Môn, Cần Thơ',
                citizenshipId: '035301001469',
                positionId: 9,
                departmentId: 2,
                avatarUrl: null,
            },
            {
                id: 'NV20230012',
                firstName: 'Nam',
                lastName: 'Nguyễn Hoàng',
                gender: true,
                dateBirth: '1997-07-06',
                phoneNumber: '0924655441',
                email: 'namnh@gmai.com',
                dateHired: '2021-11-14',
                address: 'Cái Răng, Cần Thơ',
                citizenshipId: '035301001470',
                positionId: 11,
                departmentId: 3,
                avatarUrl: null,
            },
            {
                id: 'NV20230013',
                firstName: 'Nguyên',
                lastName: 'Trần Lê',
                gender: true,
                dateBirth: '1994-08-26',
                phoneNumber: '0924655440',
                email: 'nguyentl@gmai.com',
                dateHired: '2021-11-15',
                address: 'Cái Răng, Cần Thơ',
                citizenshipId: '035301001471',
                positionId: 12,
                departmentId: 3,
                avatarUrl: null,
            },
            {
                id: 'NV20230014',
                firstName: 'Phương',
                lastName: 'Trịnh Hà',
                gender: false,
                dateBirth: '1994-08-22',
                phoneNumber: '0924655436',
                email: 'phuonght@gmai.com',
                dateHired: '2021-11-16',
                address: 'Ô Môn, Cần Thơ',
                citizenshipId: '035301001472',
                positionId: 13,
                departmentId: 3,
                avatarUrl: null,
            },
            {
                id: 'NV20230015',
                firstName: 'Tâm',
                lastName: 'Lê Minh',
                gender: true,
                dateBirth: '1995-12-08',
                phoneNumber: '0924655443',
                email: 'tamlm@gmai.com',
                dateHired: '2021-11-13',
                address: 'Ninh Kiều, Cần Thơ',
                citizenshipId: '035301001473',
                positionId: 13,
                departmentId: 3,
                avatarUrl: null,
            },
            {
                id: 'NV20230016',
                firstName: 'Thúy',
                lastName: 'Trần Diệu',
                gender: false,
                dateBirth: '1994-08-19',
                phoneNumber: '0924681193',
                email: 'thuytd@gmail.com',
                dateHired: '2022-01-22',
                address: 'Bình Thủy, Cần Thơ',
                citizenshipId: '035301001474',
                positionId: 12,
                departmentId: 3,
                avatarUrl: null,
            },
            {
                id: 'NV20230017',
                firstName: 'Trí',
                lastName: 'Lê Minh',
                gender: true,
                dateBirth: '1996-03-18',
                phoneNumber: '0924655433',
                email: 'trilm@gmail.com',
                dateHired: '2021-09-08',
                address: 'Bình Thủy, Cần Thơ',
                citizenshipId: '035301001480',
                positionId: 14,
                departmentId: 4,
                avatarUrl: null,
            },{
                id: 'NV20230018',
                firstName: 'Trung',
                lastName: 'Đinh Quốc',
                gender: true,
                dateBirth: '1999-06-29',
                phoneNumber: '0924655439',
                email: 'trungdq@gmai.com',
                dateHired: '2022-01-20',
                address: 'Ninh Kiều, Cần Thơ',
                citizenshipId: '035301001481',
                positionId: 15,
                departmentId: 4,
                avatarUrl: null,
            },{
                id: 'NV20230019',
                firstName: 'Vinh',
                lastName: 'Vũ Quang',
                gender: true,
                dateBirth: '1994-08-28',
                phoneNumber: '0924655442',
                email: 'vinhvq@gmai.com',
                dateHired: '2021-09-08',
                address: 'Ninh Kiều, Cần Thơ',
                citizenshipId: '035301001482',
                positionId: 16,
                departmentId: 4,
                avatarUrl: null,
            },{
                id: 'NV20230020',
                firstName: 'Tiên',
                lastName: 'Nguyễn Thị Cẩm',
                gender: false,
                dateBirth: '1999-06-14',
                phoneNumber: '0163533790',
                email: 'tienntc@gmail.com',
                dateHired: '2021-11-27',
                address: 'Cầu Giấy, Cần Thơ',
                citizenshipId: '035301001483',
                positionId: 15,
                departmentId: 4,
                avatarUrl: null,
            },{
                id: 'NV20230021',
                firstName: 'Minh',
                lastName: 'Lê Quang',
                gender: true,
                dateBirth: '2000-03-18',
                phoneNumber: '0984376009',
                email: 'minhlq@gmail.com',
                dateHired: '2022-04-10',
                address: 'Bình Thủy, Cần Thơ',
                citizenshipId: '035301001484',
                positionId: 17,
                departmentId: 4,
                avatarUrl: null,
            },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Employee', null, {});
    }
};
