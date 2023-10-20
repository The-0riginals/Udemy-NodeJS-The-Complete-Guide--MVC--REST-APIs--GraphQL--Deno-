const {Sequelize, DataTypes} = require('sequelize');// create a Sequelize object/class/contructor function

const sequelize = require('../util/database');// import the connection pool/ a fully configured contructor of sequelize

const User = sequelize.define('user',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        unique: true,
        allowNull: false,
    }
});

module.exports = User;

