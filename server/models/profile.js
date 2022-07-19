'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongsTo to user model
      profile.belongsTo(models.users, {
        as: "users",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  profile.init({
    image: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.TEXT,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};