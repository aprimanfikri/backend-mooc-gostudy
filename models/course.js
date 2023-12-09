const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.UserCourse, {
        foreignKey: {
          name: 'courseId',
        },
      });

      Course.hasMany(models.Chapter, {
        foreignKey: {
          name: 'courseId',
        },
      });

      Course.hasMany(models.Payment, {
        foreignKey: {
          name: 'courseId',
        },
      });

      Course.belongsTo(models.Category, {
        as: 'Category',
        foreignKey: {
          name: 'categoryId',
        },
      });

      Course.belongsTo(models.User, {
        foreignKey: {
          name: 'createdBy',
        },
      });
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.TEXT,
      imageId: DataTypes.STRING,
      level: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      benefits: DataTypes.TEXT,
      classCode: DataTypes.STRING,
      totalModule: DataTypes.INTEGER,
      type: DataTypes.STRING,
      price: DataTypes.FLOAT,
      totalDuration: DataTypes.INTEGER,
      courseBy: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Course',
    },
  );
  return Course;
};
