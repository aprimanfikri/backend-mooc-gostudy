'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasOne(models.Verified, {
        foreignKey: {
          name: 'userId',
        },
      });

      User.hasMany(models.UserCourse, {
        foreignKey: {
          name: 'userId',
        },
      });

      User.hasMany(models.UserModule, {
        foreignKey: {
          name: 'userId',
        },
      });

      User.hasMany(models.Course, {
        foreignKey: {
          name: 'createdBy',
        },
      });

      User.hasMany(models.Module, {
        foreignKey: {
          name: 'createdBy',
        },
      });

      User.hasMany(models.Purchase, {
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      password: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      imageUrl: {
        type: DataTypes.TEXT,
        defaultValue:
          'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
      },
      role: { type: DataTypes.STRING, defaultValue: 'Member' },
      verify: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
