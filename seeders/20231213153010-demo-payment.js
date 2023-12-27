"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Payments",
      [
        {
          orderId: `ORDER-UIUX001-4-${Date.now()}`,
          userId: 4,
          courseId: 1,
          price: 148750,
          paymentType: "bank_transfer",
          settlementTime: new Date(),
          status: "paid",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderId: `ORDER-UIUX002-6-${Date.now()}`,
          userId: 6,
          courseId: 2,
          price: 125000,
          paymentType: "bank_transfer",
          settlementTime: new Date(),
          status: "paid",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderId: `ORDER-DS001-7-${Date.now()}`,
          userId: 7,
          courseId: 3,
          price: 225000,
          status: "unpaid",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Payments", null, {});
  },
};
