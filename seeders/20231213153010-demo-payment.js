'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Payments',
      [
        {
          userId: 4,
          courseId: 1,
          price: 100000,
          status: 'unpaid',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 6,
          courseId: 2,
          price: 100000,
          paymentType: 'bank_tranfer',
          settlementTime: new Date(),
          status: 'paid',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 7,
          courseId: 3,
          price: 100000,
          status: 'unpaid',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Payments', null, {});
  },
};
