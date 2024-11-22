const Sequelize = require('sequelize');
const database = require('../db');
const Empresa = database.define('empresa', {
    id_empresa: {
        type: Sequelize.INTEGER, //INTEGER para int, TEXT para TEXT.
        primaryKey: true, //Isso é uma constraint
        allowNull: false, //Isso é uma constraint
        autoIncrement: true //Isso é uma constraint
    },
    nome: {
        type: Sequelize.TEXT
    },
    logo: {
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false
}
);
module.exports = Empresa;
