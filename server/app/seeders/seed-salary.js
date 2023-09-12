'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Salary', [{
            id: 1,
            basicSalary: 1000,
            allowance: 100,
            totalSalary: 1100,
            currencyId: 1,
            employeeId:'374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        {
            id: 2,
            basicSalary: 100,
            allowance: 0,
            totalSalary: 100,
            currencyId: 1,
            employeeId:'b8dc485c-bf86-46c2-b8fc-78ad135278cc',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        {
            id: 3,
            basicSalary: 1200,
            allowance: 0,
            totalSalary: 1200,
            currencyId: 1,
            employeeId:'478bfe9a-1f75-40e7-830c-5803991d10a9',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Salary', null, {});
    }
};
