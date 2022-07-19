'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongs to user
      books.belongsTo(models.users, {
        as: "users",
        foreignKey: {
          name: "idUser",
        },
      });

      // belongs to many transaction
      books.belongsToMany(models.transactions, {
        as: "transactions",
        through: {
          model: "bookspurchased",
          as: "bridge",
        },
        foreignKey: "idBook",
      });
    }
  }
  books.init({
    title: DataTypes.STRING,
    publicationdate: DataTypes.DATE,
    pages: DataTypes.STRING,
    isbn: DataTypes.STRING,
    author: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    promobook: DataTypes.STRING,
    bookattachment: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'books',
  });
  return books;
};