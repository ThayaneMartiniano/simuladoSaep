const Sequelize = require('sequelize');
const database = require('../db');
const Curso = database.define('curso', {
    id_curso: {
        type: Sequelize.INTEGER, //INTEGER para int, TEXT para TEXT.
        primaryKey: true, //Isso é uma constraint
        allowNull: false, //Isso é uma constraint
        autoIncrement: true //Isso é uma constraint
    },
    foto: {
        type: Sequelize.TEXT
    },
    nome_curso: {
        type: Sequelize.TEXT
    },
    instituicao: {
        type: Sequelize.TEXT
    },
    empresa_id: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
}
);
module.exports = Curso;
