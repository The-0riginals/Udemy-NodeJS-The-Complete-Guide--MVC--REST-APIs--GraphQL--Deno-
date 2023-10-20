const {Sequelize, DataTypes} = require('sequelize'); // create a Sequelize object/class/contructor function

const sequelize = require('../util/database'); // import the connection pool/ a fully configured contructor of sequelize

const Product = sequelize.define('product',{ // define a model/table named product
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});

module.exports = Product;