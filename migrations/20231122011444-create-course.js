const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Courses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      imageUrl: {
        type: Sequelize.TEXT,
      },
      imageId: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.ENUM(["Beginner", "Intermediate", "Advanced"]),
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      benefits: {
        type: Sequelize.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      classCode: {
        type: Sequelize.STRING,
      },
      totalModule: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM(["Free", "Premium"]),
      },
      price: {
        type: Sequelize.FLOAT,
      },
      promoPercentage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalDuration: {
        type: Sequelize.INTEGER,
      },
      courseBy: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.FLOAT,
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Courses");
  },
};
