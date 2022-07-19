'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongs to many books
      transactions.belongsToMany(models.books, {
        as: "books",
        through: {
          model: "bookspurchased",
          as: "bridge",
        },
        foreignKey: "idTransaction",
      });
      // belongs to user
      transactions.belongsTo(models.users, {
        as: "buyer",
        foreignKey: {
          name: "idBuyer",
        },
      });
      transactions.belongsTo(models.users, {
        as: "seller",
        foreignKey: {
          name: "idSeller",
        },
      });
    }
  }
  transactions.init({
    idBuyer: DataTypes.INTEGER,
    idSeller: DataTypes.INTEGER,
    totalpayment: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};