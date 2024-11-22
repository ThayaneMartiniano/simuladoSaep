import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [empresa, setEmpresa] = useState(null); // Estado para armazenar dados da empresa
    const [cursos, setCursos] = useState([]); // Estado para armazenar cursos
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isInvalid, setIsInvalid] = useState({ email: false, senha: false });
    const [comentario, setComentario] = useState(''); // Estado para armazenar o comentário
    const [comentarios, setComentarios] = useState({}); // Estado para armazenar os comentários de cada curso
    const [likes, setLikes] = useState({}); // Estado para armazenar likes de cada curso

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const handleLoginSuccess = (user) => {
        setUsuarioLogado(user);
        closeModal(); // Fecha o modal de login ao fazer login
    };

    const handleLogout = () => {
        setUsuarioLogado(null); // Limpa o estado do usuário logado
        window.location.reload(); // Reinicia a página
    };

    // Função para carregar dados da empresa e cursos
    useEffect(() => {
        async function fetchData() {
            try {
                // Carregar dados da empresa
                const empresaResponse = await fetch('http://localhost:3001/api/empresa');
                const empresaData = await empresaResponse.json();
                setEmpresa(empresaData);

                // Carregar dados dos cursos
                const cursosResponse = await fetch('http://localhost:3001/api/cursos');
                const cursosData = await cursosResponse.json();
                setCursos(cursosData);

                // Carregar os comentários de cada curso
                cursosData.forEach(async (curso) => {
                    const comentariosResponse = await fetch(`http://localhost:3001/api/cursos/${curso.id_curso}/comentarios`);
                    const comentariosData = await comentariosResponse.json();
                    setComentarios((prevComentarios) => ({
                        ...prevComentarios,
                        [curso.id_curso]: comentariosData.totalComentarios
                    }));

                    // Carregar os likes de cada curso
                    const likesResponse = await fetch(`http://localhost:3001/api/cursos/${curso.id_curso}/likes`);
                    const likesData = await likesResponse.json();
                    setLikes((prevLikes) => ({
                        ...prevLikes,
                        [curso.id_curso]: likesData.totalLikes
                    }));
                });
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        }

        fetchData();
    }, []);

    const handleLogin = async () => {
        // Limpar erros anteriores
        setError('');
        setIsInvalid({ email: false, senha: false });

        try {
            const response = await axios.post('http://localhost:3001/api/login', { email, senha });
            if (response.data.success) {
                handleLoginSuccess(response.data.user);
            } else {
                setError('Usuário ou senha incorretos');
                if (!email) setIsInvalid((prev) => ({ ...prev, email: true }));
                if (!senha) setIsInvalid((prev) => ({ ...prev, senha: true }));
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Erro ao fazer login. Tente novamente.');
        }
    };

    // Função para enviar comentário
    const handleComentarioSubmit = async (id_curso) => {
        if (!comentario) {
            alert('Por favor, escreva um comentário.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/comentarios', {
                id_usuario: usuarioLogado.id,
                id_curso: id_curso,
                mensagem: comentario
            });

            if (response.data.sucesso) {
                alert('Comentário enviado com sucesso!');
                setComentario(''); // Limpa o campo do comentário

                // Atualiza a contagem de comentários para o curso
                setComentarios((prevComentarios) => ({
                    ...prevComentarios,
                    [id_curso]: prevComentarios[id_curso] ? prevComentarios[id_curso] + 1 : 1
                }));
            } else {
                alert('Erro ao enviar comentário. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            alert('Erro ao enviar comentário.');
        }
    };

    // Função para curtir/descurtir (isLike)
    const handleLikeClick = async (id_curso) => {
        if (!usuarioLogado) {
            alert('Você precisa estar logado para curtir.');
            openModal(); // Abre o modal de login se o usuário não estiver logado
            return;
        }

        try {
            // Verifica se o usuário já deu like, se sim, remove o like, se não, adiciona
            const isLiked = likes[id_curso] && likes[id_curso].includes(usuarioLogado.id);

            // Atualiza o estado e os likes no backend
            if (isLiked) {
                // Remover like
                await axios.post('http://localhost:3001/api/inscricao', {
                    id_usuario: usuarioLogado.id,
                    id_curso: id_curso,
                    isLike: 0 // Remove o like
                });

                setLikes((prevLikes) => ({
                    ...prevLikes,
                    [id_curso]: prevLikes[id_curso] - 1 // Atualiza o contador de likes
                }));
            } else {
                // Adicionar like
                await axios.post('http://localhost:3001/api/inscricao', {
                    id_usuario: usuarioLogado.id,
                    id_curso: id_curso,
                    isLike: 1 // Adiciona o like
                });

                setLikes((prevLikes) => ({
                    ...prevLikes,
                    [id_curso]: prevLikes[id_curso] + 1 // Atualiza o contador de likes
                }));
            }
        } catch (error) {
            console.error('Erro ao atualizar like:', error);
            alert('Erro ao atualizar like. Tente novamente.');
        }
    };

    const handleIconClick = (id_curso, event) => {
        if (!usuarioLogado) {
            event.preventDefault(); // Previne a ação padrão (inscrever ou comentar)
            openModal(); // Abre o modal de login
        }
    };

    return (
        <div className="App">
            <div id="cabecalho">
                <h1>FaculHub - O Curso Certo Para Você</h1>
                <div id="imagem">
                    <img id="insta" src="./instagram.webp" alt="instagram" />
                    <img id="twitter" src="./twitter.png" alt="twitter" />
                </div>
            </div>

            <div id="corpo">
                <div id="perfil">
                    {usuarioLogado ? (
                        <button onClick={handleLogout}>Sair</button>
                    ) : (
                        <button onClick={openModal}>Entrar</button>
                    )}

                    <div id="logo">
                        <img
                            id="logos"
                            src={usuarioLogado ? usuarioLogado.foto : empresa ? empresa.logo : "./logo_faculhub.png"}
                            alt={usuarioLogado ? usuarioLogado.nickname : empresa ? empresa.nome : "FaculHub"}
                        />
                    </div>
                    <h2>{usuarioLogado ? usuarioLogado.nickname : empresa ? empresa.nome : "FaculHub"}</h2>
                    <p>Inscrições: 7</p>
                </div>

                <main>
                    <h2>Cursos</h2>
                    {cursos.map((curso) => {
                        return (
                            <div key={curso.id_curso} id="feed">
                                <div id="encima">
                                    <p>{curso.nome_curso}</p>
                                    <p>{curso.instituicao}</p>
                                </div>
                                <img src={curso.foto} alt={curso.nome_curso} />
                                <div id="embaixo">
                                    <div
                                        id="lado"
                                        onClick={() => handleLikeClick(curso.id_curso)}
                                        style={{ color: likes[curso.id_curso] > 0 ? '#FF0000' : '#000' }}
                                    >
                                        <img src="flecha_cima_vazia.svg" alt="Inscrição" />
                                        <p>{likes[curso.id_curso] || 0}</p>
                                    </div>
                                    <div id="lado1" onClick={(event) => handleIconClick(curso.id_curso, event)}>
                                        <img src="chat.svg" alt="Comentário" />
                                        <p>{comentarios[curso.id_curso] || 0}</p> {/* Mostra a quantidade de comentários */}
                                    </div>
                                </div>

                                {/* Área de comentários */}
                                <div id="comentarios">
                                    {usuarioLogado && (
                                        <div>
                                            <textarea
                                                value={comentario}
                                                onChange={(e) => setComentario(e.target.value)}
                                                placeholder="Escreva seu comentário"
                                            ></textarea>
                                            <button onClick={() => handleComentarioSubmit(curso.id_curso)}>
                                                Enviar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </main>

                {/* Login Modal */}
                {isModalVisible && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Login</h2>
                            {error && <p className="error-message">{error}</p>}
                            <div>
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={isInvalid.email ? 'input-error' : ''}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className={isInvalid.senha ? 'input-error' : ''}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button className="cancel-btn" onClick={closeModal}>Cancelar</button>
                                <button className="enter-btn" onClick={handleLogin}>Entrar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
