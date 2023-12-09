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
        role: 'admin',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin 2',
        email: 'admin2@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin 3',
        email: 'admin3@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User 1',
        email: 'user1@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User 2',
        email: 'user2@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        verify: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User 3',
        email: 'user3@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User 4',
        email: 'user4@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User 5',
        email: 'user5@gmail.com',
        phoneNumber: '12345',
        password: await hash('admin1234'),
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
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
