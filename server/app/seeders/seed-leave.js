'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Leave', [{
            id: 1,
            title: 'Sick',
            description: 'Not feeling well enough to work',
            status: 'Approved',
            leaveFrom: '2023-10-16',
            leaveTo: '2023-10-16',
            employeeId: 'NV20230002',
        },
        {
            id: 2,
            title: 'Day Off',
            description: 'Vacation with family',
            status: 'Approved',
            leaveFrom: '2023-10-25',
            leaveTo: '2023-10-27',
            employeeId: 'NV20230002',
            adminEId: 'NV20230001',
        },
        {
            id: 3,
            title: 'Day Off',
            description: 'Vacation with family',
            status: 'Approved',
            leaveFrom: '2023-10-04',
            leaveTo: '2023-10-06',
            employeeId: 'NV20230001',
            adminEId: 'NV20230001',
        },
        {
            id: 4,
            title: 'Sick',
            description: 'Not feeling well enough to work',
            status: 'Approved',
            leaveFrom: '2023-10-17',
            leaveTo: '2023-10-17',
            employeeId: 'NV20230001',
            adminEId: 'NV20230001',
        },
        ], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Leave', null, {});
    }
};
