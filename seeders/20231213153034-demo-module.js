'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Modules',
      [
        {
          name: 'Pengenalan Konsep Desain Web',
          noModule: 1,
          videoUrl: 'https://youtu.be/ixOd42SEUF0',
          videoId: 'ixOd42SEUF0',
          description: 'Pengenalan Konsep Desain Web',
          chapterId: 1,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Menjelajahi Antarmuka Figma',
          noModule: 2,
          videoUrl: 'https://youtu.be/DwTkyMJi890',
          videoId: 'DwTkyMJi890',
          description: 'Menjelajahi Antarmuka Figma',
          chapterId: 1,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Mengenal Tools di Figma',
          noModule: 1,
          videoUrl: 'https://youtu.be/rd-590n3H6w',
          videoId: 'rd-590n3H6w',
          description: 'Mengenal Tools di Figma',
          chapterId: 2,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Menggunakan Shapes dan Paths di Figma',
          noModule: 2,
          videoUrl: 'https://youtu.be/HYfG_uCOlhc',
          videoId: 'HYfG_uCOlhc',
          description: 'Menggunakan Shapes dan Paths di Figma',
          chapterId: 2,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Tujuan Mengikuti Kelas Design System',
          noModule: 1,
          videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          videoId: 'DmxXl1k0X5g',
          description: 'Tujuan Mengikuti Kelas Design System',
          chapterId: 3,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengenalan Design System',
          noModule: 2,
          videoUrl: 'https://youtu.be/1eJzLj9OE0Q',
          videoId: '1eJzLj9OE0Q',
          description: 'Pengenalan Design System',
          chapterId: 3,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Color Palette',
          noModule: 1,
          videoUrl: 'https://youtu.be/6hIUgd6WuFw',
          videoId: '6hIUgd6WuFw',
          description: 'Color Palette',
          chapterId: 4,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Typhography, Layout, dan Grid',
          noModule: 2,
          videoUrl: 'https://youtu.be/6hXoBeIQd-o',
          videoId: '6hXoBeIQd-o',
          description: 'Typhography, Layout, dan Grid',
          chapterId: 4,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // <=== PEMBATAS ===>
        {
          name: 'Pengenalan Python',
          noModule: 1,
          videoUrl: 'https://youtu.be/HVmmrTBdiFY',
          videoId: 'HVmmrTBdiFY',
          description: 'Pengenalan Python',
          chapterId: 5,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Instalasi Python dan Lingkungan Pengembangan',
          noModule: 2,
          videoUrl: 'https://youtu.be/eSrXU5vrgaI',
          videoId: 'eSrXU5vrgaI',
          description: 'Instalasi Python dan Lingkungan Pengembangan',
          chapterId: 5,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variabel dan Tipe Data',
          noModule: 1,
          videoUrl: 'https://youtu.be/JVJc4k6xjTM',
          videoId: 'JVJc4k6xjTM',
          description: 'Variabel dan Tipe Data',
          chapterId: 6,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Operasi Dasar dan Ekspresi',
          noModule: 2,
          videoUrl: 'https://youtu.be/Sl0YBFJuvSU',
          videoId: 'Sl0YBFJuvSU',
          description: 'Operasi Dasar dan Ekspresi',
          chapterId: 6,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Gambaran Umum Deep Learning',
          noModule: 1,
          videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          videoId: 'DmxXl1k0X5g',
          description: 'Gambaran Umum Deep Learning',
          chapterId: 7,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Sejarah Perspektif',
          noModule: 2,
          videoUrl: 'https://youtu.be/1eJzLj9OE0Q',
          videoId: '1eJzLj9OE0Q',
          description: 'Sejarah Perspektif',
          chapterId: 7,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Konsep Dasar Neural Networks',
          noModule: 1,
          videoUrl: 'https://youtu.be/6hIUgd6WuFw',
          videoId: '6hIUgd6WuFw',
          description: 'Konsep Dasar Neural Networks',
          chapterId: 8,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Neurons dan Activation Functions',
          noModule: 2,
          videoUrl: 'https://youtu.be/6hXoBeIQd-o',
          videoId: '6hXoBeIQd-o',
          description: 'Neurons dan Activation Functions',
          chapterId: 8,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pendahuluan Kotlin',
          noModule: 1,
          videoUrl: 'https://youtu.be/ixOd42SEUF0',
          videoId: 'ixOd42SEUF0',
          description: 'Pendahuluan Kotlin',
          chapterId: 9,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Konfigurasi Android Studio',
          noModule: 2,
          videoUrl: 'https://youtu.be/DwTkyMJi890',
          videoId: 'DwTkyMJi890',
          description: 'Konfigurasi Android Studio',
          chapterId: 9,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Tipe Data, Variabel, dan Operator',
          noModule: 1,
          videoUrl: 'https://youtu.be/rd-590n3H6w',
          videoId: 'rd-590n3H6w',
          description: 'Tipe Data, Variabel, dan Operator',
          chapterId: 10,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Ekspresi, Looping, and Functions',
          noModule: 2,
          videoUrl: 'https://youtu.be/HYfG_uCOlhc',
          videoId: 'HYfG_uCOlhc',
          description: 'Ekspresi, Looping, and Functions',
          chapterId: 10,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengenalan Java untuk Android',
          noModule: 1,
          videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          videoId: 'DmxXl1k0X5g',
          description: 'Pengenalan Java untuk Android',
          chapterId: 11,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Konfigurasi Environtment',
          noModule: 2,
          videoUrl: 'https://youtu.be/1eJzLj9OE0Q',
          videoId: '1eJzLj9OE0Q',
          description: 'Konfigurasi Environtment',
          chapterId: 11,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Tipe Data, Variabel, dan Operasi',
          noModule: 1,
          videoUrl: 'https://youtu.be/6hIUgd6WuFw',
          videoId: '6hIUgd6WuFw',
          description: 'Tipe Data, Variabel, dan Operasi',
          chapterId: 12,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Perulangan dan Percabangan',
          noModule: 2,
          videoUrl: 'https://youtu.be/6hXoBeIQd-o',
          videoId: '6hXoBeIQd-o',
          description: 'Perulangan dan Percabangan',
          chapterId: 12,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengenalan Bahasa Pemrograman Swift',
          noModule: 1,
          videoUrl: 'https://youtu.be/ixOd42SEUF0',
          videoId: 'ixOd42SEUF0',
          description: 'Pengenalan Bahasa Pemrograman Swift',
          chapterId: 13,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengenalan Platform IOS dan Konfigurasi Environment',
          noModule: 2,
          videoUrl: 'https://youtu.be/DwTkyMJi890',
          videoId: 'DwTkyMJi890',
          description: 'Pengenalan Platform IOS dan Konfigurasi Environment',
          chapterId: 13,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variabel, Tipe Data, dan Operator',
          noModule: 1,
          videoUrl: 'https://youtu.be/rd-590n3H6w',
          videoId: 'rd-590n3H6w',
          description: 'Variabel, Tipe Data, dan Operator',
          chapterId: 14,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Ekspresi, Perulangan, dan Percabangan',
          noModule: 2,
          videoUrl: 'https://youtu.be/HYfG_uCOlhc',
          videoId: 'HYfG_uCOlhc',
          description: 'Ekspresi, Perulangan, dan Percabangan',
          chapterId: 14,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengenalan React JS',
          noModule: 1,
          videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          videoId: 'DmxXl1k0X5g',
          description: 'Pengenalan React JS',
          chapterId: 15,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Konfigurasi Development Environment',
          noModule: 2,
          videoUrl: 'https://youtu.be/1eJzLj9OE0Q',
          videoId: '1eJzLj9OE0Q',
          description: 'Konfigurasi Development Environment',
          chapterId: 15,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Komponen dan Props',
          noModule: 1,
          videoUrl: 'https://youtu.be/6hIUgd6WuFw',
          videoId: '6hIUgd6WuFw',
          description: 'Komponen dan Props',
          chapterId: 16,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'State dan Lifecycle',
          noModule: 2,
          videoUrl: 'https://youtu.be/6hXoBeIQd-o',
          videoId: '6hXoBeIQd-o',
          description: 'State dan Lifecycle',
          chapterId: 16,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengenalan Node.js',
          noModule: 1,
          videoUrl: 'https://youtu.be/ixOd42SEUF0',
          videoId: 'ixOd42SEUF0',
          description: 'Pengenalan Node.js',
          chapterId: 17,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Instalasi dan Konfigurasi Development Environment',
          noModule: 2,
          videoUrl: 'https://youtu.be/DwTkyMJi890',
          videoId: 'DwTkyMJi890',
          description: 'Instalasi dan Konfigurasi Development Environment',
          chapterId: 17,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Struktur Dasar Node.js',
          noModule: 1,
          videoUrl: 'https://youtu.be/rd-590n3H6w',
          videoId: 'rd-590n3H6w',
          description: 'Struktur Dasar Node.js',
          chapterId: 18,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module, Package, dan Async',
          noModule: 2,
          videoUrl: 'https://youtu.be/HYfG_uCOlhc',
          videoId: 'HYfG_uCOlhc',
          description: 'Module, Package, dan Async',
          chapterId: 18,
          createdBy: 1,
          isUnlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Definisi dan Peran Manajemen Produk',
          noModule: 1,
          videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          videoId: 'DmxXl1k0X5g',
          description: 'Definisi dan Peran Manajemen Produk',
          chapterId: 19,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pentingnya Manajemen Product dalam Bisnis Digital',
          noModule: 2,
          videoUrl: 'https://youtu.be/1eJzLj9OE0Q',
          videoId: '1eJzLj9OE0Q',
          description: 'Pentingnya Manajemen Product dalam Bisnis Digital',
          chapterId: 19,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Analisis Pasar dalam konteks Bisnis Digital',
          noModule: 1,
          videoUrl: 'https://youtu.be/6hIUgd6WuFw',
          videoId: '6hIUgd6WuFw',
          description: 'Analisis Pasar dalam konteks Bisnis Digital',
          chapterId: 20,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Mengenali Kebutuhan dan Ekspektasi Konsumen',
          noModule: 2,
          videoUrl: 'https://youtu.be/6hXoBeIQd-o',
          videoId: '6hXoBeIQd-o',
          description: 'Mengenali Kebutuhan dan Ekspektasi Konsumen',
          chapterId: 20,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pengantar Data Mining',
          noModule: 1,
          videoUrl: 'https://youtu.be/DmxXl1k0X5g',
          videoId: 'DmxXl1k0X5g',
          description: 'Pengantar Data Mining',
          chapterId: 21,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pentingnya Data Mining dalam Pengambilan keputusan',
          noModule: 2,
          videoUrl: 'https://youtu.be/1eJzLj9OE0Q',
          videoId: '1eJzLj9OE0Q',
          description: 'Pentingnya Data Mining dalam Pengambilan keputusan',
          chapterId: 21,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Konsep Dasar Data Mining',
          noModule: 1,
          videoUrl: 'https://youtu.be/6hIUgd6WuFw',
          videoId: '6hIUgd6WuFw',
          description: 'Konsep Dasar Data Mining',
          chapterId: 22,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Faktor Kunci dalam Analisis Data',
          noModule: 2,
          videoUrl: 'https://youtu.be/6hXoBeIQd-o',
          videoId: '6hXoBeIQd-o',
          description: 'Faktor Kunci dalam Analisis Data',
          chapterId: 22,
          createdBy: 1,
          isUnlocked: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Modules', null, {});
  },
};
