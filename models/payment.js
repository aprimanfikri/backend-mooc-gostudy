const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
      });

      Payment.belongsTo(models.Course, {
        foreignKey: {
          name: "courseId",
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
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
