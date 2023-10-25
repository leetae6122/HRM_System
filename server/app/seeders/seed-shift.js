'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Shift', [{
            id: 1,
            name: 'Morning',
            startTime: '08:00:00',
            endTime: '12:00:00',
            overtimeShift: false
        },
        {
            id: 2,
            name: 'Afternoon',
            startTime: '13:00:00',
            endTime: '17:00:00',
            overtimeShift: false
        },
        {
            id: 3,
            name: 'Overtime',
            startTime: '18:00:00',
            endTime: '20:00:00',
            overtimeShift: true
        }], {

        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Shift', null, {});
    }
};
