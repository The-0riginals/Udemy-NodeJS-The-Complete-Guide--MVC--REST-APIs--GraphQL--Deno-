const {Sequelize, DataTypes} = require('sequelize');// create a Sequelize object/class/contructor function

const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
    }
});

module.exports = CartItem;
