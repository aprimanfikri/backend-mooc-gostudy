const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Verified extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Verified.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  Verified.init(
    {
      userId: DataTypes.INTEGER,
      otp: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Verified',
    },
  );
  return Verified;
};
