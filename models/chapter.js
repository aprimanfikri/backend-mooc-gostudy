const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chapter.hasMany(models.Module, {
        foreignKey: {
          name: "chapterId",
        },
      });

      Chapter.belongsTo(models.Course, {
        foreignKey: {
          name: "courseId",
        },
      });
    }
  }
  Chapter.init(
    {
      noChapter: DataTypes.INTEGER,
      name: DataTypes.STRING,
      courseId: DataTypes.INTEGER,
      totalDuration: DataTypes.INTEGER,
      totalModule: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Chapter",
    }
  );
  return Chapter;
};
