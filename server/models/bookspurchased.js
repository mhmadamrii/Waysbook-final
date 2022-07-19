'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookspurchased extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bookspurchased.init({
    idBook: DataTypes.INTEGER,
    idTransaction: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'bookspurchased',
  });
  return bookspurchased;
};