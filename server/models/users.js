'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // has one profile
      users.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser",
        },
      });

      // has many products
      users.hasMany(models.books, {
        as: "books",
        foreignKey: {
          name: "idUser",
        },
      });

      // has many transactions
      users.hasMany(models.transactions, {
        as: "buyerTransactions",
        foreignKey: {
          name: "idBuyer",
        },
      });
      users.hasMany(models.transactions, {
        as: "sellerTransactions",
        foreignKey: {
          name: "idSeller",
        },
      });

      //hasMany association to chat model
      users.hasMany(models.chats, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender",
        },
      });
      users.hasMany(models.chats, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient",
        },
      });
    }
  }
  users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};