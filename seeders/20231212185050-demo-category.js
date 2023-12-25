"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: "UI/UX Design",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Data Science",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Android Development",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "IOS Development",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Front End Web Development",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Back End Web Development",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product Management",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Data Mining",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const categoriesWithSlug = categories.map((category) => ({
      ...category,
      slug: category.name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/\//g, "_"),
    }));

    await queryInterface.bulkInsert("Categories", categoriesWithSlug, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
