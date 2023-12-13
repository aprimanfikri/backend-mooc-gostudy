'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Categories',
      [
        {
          name: 'Category 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Category 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Category 3',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Category 4',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Category 5',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
