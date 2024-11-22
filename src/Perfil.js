function Perfil({ foto, nome, inscricoes, openLoginModal, usuarioLogado, handleLogout }) {
    return (
        <div id="perfil">
            {usuarioLogado ? (
                // Se o usuário estiver logado, mostra o botão de sair
                <button onClick={handleLogout}>Sair</button>
            ) : (
                // Caso contrário, mostra o botão de entrar
                <button onClick={openLoginModal}>Entrar</button>
            )}

            <div id="logo">
                <img id="logos" src={foto} alt={nome} />
            </div>
            <h2>{nome}</h2>
            <p>Inscrições: {inscricoes}</p>
        </div>
    );
}
export default Perfil;
