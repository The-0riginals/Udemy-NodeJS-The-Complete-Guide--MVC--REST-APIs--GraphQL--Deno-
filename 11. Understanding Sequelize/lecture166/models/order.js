const {Sequelize, DataTypes} = require('sequelize');// create a Sequelize object/class/contructor function

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;
