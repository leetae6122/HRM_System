'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Office', [{
            id: 1,
            title: 'Can Tho Office',
            streetAddress: 'No.001, 30/4 Street, Xuan Khanh Ward, Ninh Kieu District',
            postalCode: 902080,
            city: 'Can Tho',
            countryId: 5
        },
        {
            id: 2,
            title: 'Ho Chi Minh Office',
            streetAddress: '82 Tran Huy Lieu Street, Ward 15, Phu Nhuan District',
            postalCode: 72200,
            city: 'Ho Chi Minh',
            countryId: 5
        },
        {
            id: 3,
            title: 'Ha Noi Office',
            streetAddress: '10 Pham Van Bach, Dich Vong Ward, Cau Giay District',
            postalCode: 122000,
            city: 'Ha Noi',
            countryId: 5
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Office', null, {});
    }
};
