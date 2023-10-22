const {Sequelize, DataTypes} = require('sequelize');// create a Sequelize object/class/contructor function

const sequelize = require('../util/database');
 
const OrderItem = sequelize.define('orderItem', {
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
 
module.exports = OrderItem;
