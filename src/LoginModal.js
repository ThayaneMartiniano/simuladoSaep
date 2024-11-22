import React, { useState } from 'react';
import axios from 'axios';

function LoginModal({ showModal, closeModal, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isInvalid, setIsInvalid] = useState({ email: false, senha: false });

    const handleLogin = async () => {
        // Limpar erros anteriores
        setError('');
        setIsInvalid({ email: false, senha: false });

        try {
            const response = await axios.post('http://localhost:3001/api/login', { email, senha });
            if (response.data.success) {
                onLoginSuccess(response.data.user);
                closeModal();
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

    if (!showModal) return null;

    return (
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
    );
}

export default LoginModal;