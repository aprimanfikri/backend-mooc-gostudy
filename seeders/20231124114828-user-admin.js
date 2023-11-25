'use strict';

/** @type {import('sequelize-cli').Migration} */
const { hash } = require('../utils/bcrypt');

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

    // const admin = {
    //   name: 'Admin 1',
    //   email: 'admin1@gmail.com',
    //   phoneNumber: '12345',
    //   password: 'admin1234',
    //   country: 'Indonesia',
    //   city: 'Jakarta',
    //   role: 'Admin',
    //   verify: true,
    // };

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin 1',
        email: 'admin1@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'Admin',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
      {};
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  },
};
