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
    static afterCreate(module, options) {
      return sequelize.models.Course.increment(
        {
          totalDuration: module.duration,
          totalModule: 1,
        },
        {
          where: { id: module.chapter.courseId },
          transaction: options.transaction,
        }
      );
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
    }
  );
  return Module;
};
