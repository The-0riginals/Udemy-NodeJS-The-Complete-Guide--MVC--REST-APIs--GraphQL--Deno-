const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '19001009', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;