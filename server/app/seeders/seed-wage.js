'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Wage', [{
            id: 1,
            basicHourlyWage: 150000,
            hourlyOvertimePay: 225000,
            employeeId: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        {
            id: 2,
            basicHourlyWage: 10000,
            hourlyOvertimePay: 15000,
            employeeId: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc',
            addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        // {
        //     id: 3,
        //     basicHourlyWage: 10000,
        //     hourlyOvertimePay: 15000,
        //     employeeId: '478bfe9a-1f75-40e7-830c-5803991d10a9',
        //     addedBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        // }
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Wage', null, {});
    }
};
