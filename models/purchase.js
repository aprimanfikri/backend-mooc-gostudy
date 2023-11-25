'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Purchase.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      });

      Purchase.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
        },
      });
    }
  }
  Purchase.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Purchase',
    }
  );
  return Purchase;
};
