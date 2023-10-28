'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Salary', [{
            id: 1,
            basicHourlySalary: 150000,
            hourlyOvertimeSalary: 225000,
            allowance: 0,
            currencyId: 2,
            employeeId: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        {
            id: 2,
            basicHourlySalary: 10000,
            hourlyOvertimeSalary: 15000,
            allowance: 0,
            currencyId: 2,
            employeeId: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        // {
        //     id: 3,
        //     basicHourlySalary: 10000,
        //     hourlyOvertimeSalary: 15000,
        //     allowance: 0,
        //     currencyId: 2,
        //     employeeId: '478bfe9a-1f75-40e7-830c-5803991d10a9',
        //     addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        // }
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Salary', null, {});
    }
};
