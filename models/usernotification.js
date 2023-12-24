"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserNotification.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
      });
      UserNotification.belongsTo(models.Notification, {
        foreignKey: {
          name: "notifId",
        },
      });
    }
  }
  UserNotification.init(
    {
      userId: DataTypes.INTEGER,
      notifId: DataTypes.INTEGER,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "UserNotification",
    }
  );
  return UserNotification;
};
