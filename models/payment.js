const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      });

      Payment.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
        },
      });
    }
  }
  Payment.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      paymentType: DataTypes.STRING,
      settlementTime: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'unpaid',
      },
    },
    {
      sequelize,
      modelName: 'Payment',
    }
  );
  return Payment;
};
