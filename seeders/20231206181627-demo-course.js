/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Courses", [
      {
        name: "Course 1",
        level: "Beginner",
        categoryId: 1,
        description: "Course description",
        benefits: ["Course benefits"],
        classCode: "Course123",
        // totalModule: 1,
        type: "Free",
        price: 100000,
        courseBy: "me",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Course 2",
        level: "Intermediate",
        categoryId: 2,
        description: "Course 2 description",
        benefits: ["Course 2 benefits"],
        classCode: "Course2",
        type: "Premium",
        price: 150000,
        courseBy: "you",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Course 3",
        level: "Advanced",
        categoryId: 3,
        description: "Course 3 description",
        benefits: ["Course 3 benefits"],
        classCode: "Course3",
        type: "Premium",
        price: 200000,
        courseBy: "someone",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Course 4",
        level: "Beginner",
        categoryId: 1,
        description: "Course 4 description",
        benefits: ["Course 4 benefits"],
        classCode: "Course4",
        type: "Free",
        price: 120000,
        courseBy: "another",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Course 5",
        level: "Intermediate",
        categoryId: 2,
        description: "Course 5 description",
        benefits: ["Course 5 benefits"],
        classCode: "Course5",
        type: "Premium",
        price: 180000,
        courseBy: "someone_else",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
      {};
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null, {});
  },
};
