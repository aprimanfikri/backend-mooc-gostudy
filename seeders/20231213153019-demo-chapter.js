"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Chapters",
      [
        {
          noChapter: 1,
          name: "Chapter 1",
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Chapter 2",
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Chapter 1",
          courseId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Chapter 2",
          courseId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Chapter 1",
          courseId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Chapter 2",
          courseId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chapters", null, {});
  },
};
