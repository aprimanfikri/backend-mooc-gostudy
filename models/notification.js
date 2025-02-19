"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.hasMany(models.UserNotification, {
        foreignKey: {
          name: "notifId",
        },
      });
    }
  }
  Notification.init(
    {
      category: {
        type: DataTypes.ENUM,
        values: ["Promosi", "Notifikasi"],
        defaultValue: "Notifikasi",
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
