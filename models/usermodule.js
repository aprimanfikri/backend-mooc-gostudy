"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserModule.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
      });
      UserModule.belongsTo(models.Chapter, {
        foreignKey: {
          name: "chapterId",
        },
      });
      UserModule.belongsTo(models.Module, {
        foreignKey: {
          name: "moduleId",
        },
      });
    }
  }
  UserModule.init(
    {
      userId: DataTypes.INTEGER,
      moduleId: DataTypes.INTEGER,
      chapterId: DataTypes.INTEGER,
      isStudied: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "UserModule",
    }
  );
  return UserModule;
};
