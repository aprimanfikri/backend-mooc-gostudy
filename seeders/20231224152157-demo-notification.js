"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Notifications", [
      {
        category: "Notifikasi",
        title: "Password berhasil diubah",
        description:
          "Password untuk akun Anda telah berhasil diubah. Keamanan akun Anda sekarang diperbarui. Jika Anda tidak melakukan perubahan ini, segera hubungi dukungan pelanggan kami.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category: "Notifikasi",
        title: "Akun anda berhasil dibuat",
        description:
          "Selamat! Akun anda sudah terdaftar, terima kasih sudah memilih layanan kami.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category: "Notifikasi",
        title: "Profile berhasil diubah",
        description:
          "Profile untuk akun Anda telah berhasil diubah. Data diri akun Anda sekarang diperbarui. Jika Anda tidak melakukan perubahan ini, segera hubungi dukungan pelanggan kami.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category: "Promosi",
        title: "Dapatkan Potongan 30% selama Bulan Juni 🎉",
        description:
          "Hanya untuk Anda, nikmati potongan harga eksklusif sebesar 30% untuk setiap pembelian selama Bulan Juni! Jangan lewatkan kesempatan istimewa ini untuk berbelanja dan hemat lebih banyak.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category: "Promosi",
        title: "Jelajahi Ilmu Baru 🚀",
        description:
          "Pelajari topik terpanas dan tingkatkan keterampilan Anda dengan kursus terbaru kami! Dapatkan diskon 20% untuk pendaftaran pertama Anda.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Notifications", null, {});
  },
};
