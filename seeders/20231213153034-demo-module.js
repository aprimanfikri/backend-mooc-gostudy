"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Modules",
      [
        {
          name: "Module 1",
          noModule: 1,
          videoUrl: "http://localhost:3000",
          videoId: "12313124312",
          description: "Module 1",
          chapterId: 1,
          duration: 100,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Module 2",
          noModule: 2,
          videoUrl: "http://localhost:3000",
          videoId: "12313124312",
          description: "Module 2",
          chapterId: 1,
          duration: 100,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Module 1",
          noModule: 1,
          videoUrl: "http://localhost:3000",
          videoId: "12313124312",
          description: "Module 1",
          chapterId: 2,
          duration: 100,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Module 2",
          noModule: 2,
          videoUrl: "http://localhost:3000",
          videoId: "12313124312",
          description: "Module 2",
          chapterId: 2,
          duration: 100,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Module 1",
          noModule: 1,
          videoUrl: "http://localhost:3000",
          videoId: "12313124312",
          description: "Module 1",
          chapterId: 3,
          duration: 100,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Module 2",
          noModule: 2,
          videoUrl: "http://localhost:3000",
          videoId: "12313124312",
          description: "Module 2",
          chapterId: 3,
          duration: 100,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Modules", null, {});
  },
};
