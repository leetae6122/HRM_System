'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Leave', [{
            id: 1,
            title: 'Sick',
            description: 'Not feeling well enough to work',
            status: 'Pending',
            leaveFrom: '2023-10-16',
            leaveTo: '2023-10-16',
            employeeId: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc',
        },
        {
            id: 2,
            title: 'Day Off',
            description: 'Vacation with family',
            status: 'Approved',
            leaveFrom: '2023-10-25',
            leaveTo: '2023-10-27',
            employeeId: 'b8dc485c-bf86-46c2-b8fc-78ad135278cc',
            handledBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        {
            id: 3,
            title: 'Day Off',
            description: 'Vacation with family',
            status: 'Approved',
            leaveFrom: '2023-10-04',
            leaveTo: '2023-10-06',
            employeeId: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
            handledBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        {
            id: 4,
            title: 'Sick',
            description: 'Not feeling well enough to work',
            status: 'Approved',
            leaveFrom: '2023-10-17',
            leaveTo: '2023-10-17',
            employeeId: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
            handledBy: '374bcdc0-dceb-4940-952a-d6a2d1cf53f9',
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Leave', null, {});
    }
};
