"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Chapters",
      [
        {
          noChapter: 1,
          name: "Pengenalan pada Desain Web dan Figma",
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-Dasar Desain Grafis dengan Figma",
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan",
          courseId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Memulai Desain",
          courseId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan Python",
          courseId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar Python",
          courseId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan Deep Learning",
          courseId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar Neural Networks",
          courseId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pengenalan Kotlin dan Android Studio",
          courseId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Struktur Proyek Android",
          courseId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan ke Pemrograman Java",
          courseId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar Pemrograman Java",
          courseId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan ke Swift dan iOS Development",
          courseId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar Pemrograman Swift",
          courseId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan ReactJS",
          courseId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar ReactJS",
          courseId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan Node.js",
          courseId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar Node.js",
          courseId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pengenalan Manajemen Produk",
          courseId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Pemahaman Pasar dan Pelanggan",
          courseId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 1,
          name: "Pendahuluan Data Mining",
          courseId: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          noChapter: 2,
          name: "Dasar-dasar Data Mining",
          courseId: 11,
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
