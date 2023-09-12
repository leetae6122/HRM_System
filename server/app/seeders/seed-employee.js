'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Employee', [{
            id: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
            firstName: 'Tri',
            lastName: 'Le Duong',
            email: 'tri.hrms@gmail.com',
            phoneNumber: '0831234567',
            gender: true,
            dateBirth: '1992-03-16',
            hireDate: '2019-08-27',
            avatarUrl: null,
            address: '3/2 Xuan Khanh, Ninh Kieu, Can Tho',
            positionId: 1,
            // departmentId: null
        },
        {
            id: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc',
            firstName: 'Steven',
            lastName: 'Askew',
            email: 'steven@gmail.com',
            phoneNumber: '07444440001',
            gender: true,
            dateBirth: '1990-02-18',
            hireDate: '2020-11-27',
            avatarUrl: null,
            address: '3721 Hill Croft Farm Road, BURLINGTON, MI',
            positionId: 2,
            // departmentId: null
        },
        {
            id: '478bfe9a-1f75-40e7-830c-5803991d10a9',
            firstName: 'Tatiana',
            lastName: 'Breit',
            email: 'tatiana@gmail.com',
            phoneNumber: '07402222220',
            gender: false,
            dateBirth: '1994-10-14',
            hireDate: '2021-02-21',
            avatarUrl: null,
            address: '3397  Happy Hollow Road, Jacksonville, NC',
            positionId: 3,
            // departmentId: null
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Employee', null, {});
    }
};
