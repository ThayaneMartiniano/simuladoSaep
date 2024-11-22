// Importando dependências
const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');

// Configuração do banco de dados
const sequelize = new Sequelize('saep', 'root', 'admin', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});

// Definindo o modelo 'Curso'
const Curso = sequelize.define('curso', {
    id_curso: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
});

// Definindo o modelo 'Empresa'
const Empresa = sequelize.define('empresa', {
    id_empresa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
});

// Definindo o modelo 'Usuario'
const Usuario = sequelize.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.TEXT
    },
    nickname: {
        type: Sequelize.TEXT
    },
    senha: {
        type: Sequelize.INTEGER
    },
    foto: {
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Definindo o modelo 'Comentario'
const Comentario = sequelize.define('comentario', {
    id_comentario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    id_curso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Curso,
            key: 'id_curso'
        }
    },
    mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});
// Definindo o modelo 'Inscricao'
const Inscricao = sequelize.define('inscricao', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    id_curso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Curso,
            key: 'id_curso'
        }
    },
    isLike: {
        type: Sequelize.INTEGER,
        defaultValue: 0  // 0 para não, 1 para sim (indicar um "like")
    },
    isDeslike: {
        type: Sequelize.INTEGER,
        defaultValue: 0  // 0 para não, 1 para sim (indicar um "dislike")
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Definindo as associações (relacionamentos)
// Um usuário pode se inscrever em vários cursos e um curso pode ter vários usuários inscritos
Usuario.belongsToMany(Curso, { through: Inscricao, foreignKey: 'id' });
Curso.belongsToMany(Usuario, { through: Inscricao, foreignKey: 'id_curso' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rota para login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email, senha } });

    if (usuario) {
        res.json({ success: true, user: usuario });
    } else {
        res.json({ success: false });
    }
});

// Rota para listar usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Rota para pegar informações da empresa
app.get('/api/empresa', async (req, res) => {
    try {
        const empresa = await Empresa.findOne();
        res.json(empresa);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
});

// Rota para pegar todos os cursos
app.get('/api/cursos', async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
});

// Rota para adicionar comentário
app.post('/api/comentarios', async (req, res) => {
    const { id_usuario, id_curso, mensagem } = req.body;

    try {
        const novoComentario = await Comentario.create({
            id: id_usuario,
            id_curso: id_curso,
            mensagem: mensagem
        });

        res.status(201).json({ sucesso: true, comentario: novoComentario });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: 'Erro ao adicionar comentário' });
    }
});

// Rota para buscar o número de comentários de um curso específico
app.get('/api/cursos/:id_curso/comentarios', async (req, res) => {
    const { id_curso } = req.params;

    try {
        const totalComentarios = await Comentario.count({
            where: { id_curso: id_curso }
        });

        res.json({ totalComentarios });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar comentários' });
    }
});

// Conexão com o banco de dados e sincronização dos modelos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync();
        app.listen(PORT, () => {
            console.log('Servidor rodando na porta 3001');
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
})();
// Rota para adicionar comentário
app.post('/api/comentarios', async (req, res) => {
    const { id_usuario, id_curso, mensagem } = req.body;

    try {
        const novoComentario = await Comentario.create({
            id: id_usuario,
            id_curso: id_curso,
            mensagem: mensagem
        });

        // Contar o número de comentários após a inserção
        const totalComentarios = await Comentario.count({
            where: { id_curso: id_curso }
        });

        res.status(201).json({ sucesso: true, comentario: novoComentario, totalComentarios });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: 'Erro ao adicionar comentário' });
    }
});
// Rota para adicionar ou atualizar inscrição (like/deslike)
app.post('/api/inscricao', async (req, res) => {
    const { id_usuario, id_curso, isLike, isDeslike } = req.body;

    try {
        const [inscricao, created] = await Inscricao.upsert({
            id: id_usuario,
            id_curso: id_curso,
            isLike: isLike,
            isDeslike: isDeslike
        });

        res.status(201).json({ sucesso: true, inscricao });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: 'Erro ao inscrever ou atualizar inscrição' });
    }
});
// Rota para adicionar ou atualizar inscrição (like/deslike)
app.post('/api/inscricao', async (req, res) => {
    const { id_usuario, id_curso, isLike, isDeslike } = req.body;

    try {
        // Verificando se o usuário já possui inscrição
        const inscricaoExistente = await Inscricao.findOne({
            where: { id: id_usuario, id_curso: id_curso }
        });

        if (inscricaoExistente) {
            // Atualizando o "like" e "deslike" existentes
            inscricaoExistente.isLike = isLike;
            inscricaoExistente.isDeslike = isDeslike;
            await inscricaoExistente.save();
        } else {
            // Criando uma nova inscrição se não existir
            await Inscricao.create({
                id: id_usuario,
                id_curso: id_curso,
                isLike: isLike,
                isDeslike: isDeslike
            });
        }

        // Retornar sucesso
        res.status(201).json({ sucesso: true });

    } catch (error) {
        res.status(500).json({ sucesso: false, erro: 'Erro ao inscrever ou atualizar inscrição' });
    }
});
// Rota para buscar o número de likes de um curso específico
app.get('/api/cursos/:id_curso/likes', async (req, res) => {
    const { id_curso } = req.params;

    try {
        const totalLikes = await Inscricao.count({
            where: { id_curso: id_curso, isLike: 1 }
        });

        res.json({ totalLikes });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar likes' });
    }
});

