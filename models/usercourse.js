const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserCourse.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      });
      UserCourse.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
        },
      });
    }
  }
  UserCourse.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      isAccessible: DataTypes.BOOLEAN,
      totalProgress: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      certificateSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'UserCourse',
    }
  );
  return UserCourse;
};
