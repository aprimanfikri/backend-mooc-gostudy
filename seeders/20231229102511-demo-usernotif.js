"use strict";

/** @type {import('sequelize-cli').Migration} */
const { formatTime, formatDate } = require("../utils/dateTime");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const formattedDate = formatDate(new Date());
    const formattedTime = formatTime(new Date());
    const date = `${formattedDate}, ${formattedTime}`;

    await queryInterface.bulkInsert(
      "UserNotifications",
      [
        {
          userId: 1,
          notifId: 2,
          dateSent: date,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("UserNotifications", null, {});
  },
};
