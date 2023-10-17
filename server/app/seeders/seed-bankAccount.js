'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('BankAccount', [{
            id: 1,
            accountName: 'LE DUONG TRI',
            bankName: 'Ngan Hang TMCP Dau Tu va Phat Trien Viet Nam (BIDV)',
            accountNum: '13810000012345',
            employeeId: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9'
        },
        {
            id: 2,
            accountName: 'STEVEN ASKEW',
            bankName: 'Ngan Hang TMCP Dau Tu va Phat Trien Viet Nam (BIDV)',
            accountNum: '0071000012345',
            employeeId: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc'
        },
        {
            id: 3,
            accountName: 'TATIANA BREIT',
            bankName: 'Ngan Hang TMCP Ngoai Thuong Viet Nam (VCB)',
            accountNum: '8286012345',
            employeeId: '478bfe9a-1f75-40e7-830c-5803991d10a9'
        },], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('BankAccount', null, {});
    }
};
