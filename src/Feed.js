import React from 'react';

function Feed({ nomeCurso, instituicao, fotoCurso, insc, comentario, seta1, balao, usuarioLogado, openLoginModal }) {

    const handleIconClick = (event) => {
        // Se o usuário não estiver logado, abre o modal de login
        if (!usuarioLogado) {
            event.preventDefault();  // Previne a ação padrão (inscrever ou comentar)
            openLoginModal();  // Abre o modal de login
        }
    };

    return (
        <div id="feed">
            <div id="encima">
                <p>{nomeCurso}</p>
                <p>{instituicao}</p>
            </div>
            <img src={fotoCurso} alt={nomeCurso} />
            <div id="embaixo">
                <div id="lado" onClick={handleIconClick}>
                    <img src={seta1} alt="Inscrição" />
                    <p>{insc}</p>
                </div>
                <div id="lado1" onClick={handleIconClick}>
                    <img src={balao} alt="Comentário" />
                    <p>{comentario}</p>
                </div>
            </div>
        </div>
    );
}

export default Feed;
