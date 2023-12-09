const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Module.hasMany(models.UserModule, {
        foreignKey: {
          name: 'moduleId',
        },
      });

      Module.belongsTo(models.Chapter, {
        foreignKey: {
          name: 'chapterId',
        },
      });

      Module.belongsTo(models.User, {
        foreignKey: {
          name: 'createdBy',
        },
      });
    }
  }
  Module.init(
    {
      name: DataTypes.STRING,
      noModule: DataTypes.INTEGER,
      videoUrl: DataTypes.TEXT,
      videoId: DataTypes.STRING,
      description: DataTypes.TEXT,
      chapterId: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Module',
    },
  );
  return Module;
};
