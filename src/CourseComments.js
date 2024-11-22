import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseComments({ courseId }) {
  const [comentarios, setComentarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Função para buscar comentários do curso
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/comentarios/${courseId}`);
        setComentarios(response.data);
      } catch (err) {
        setError('Erro ao carregar os comentários');
        console.error(err);
      }
    };

    fetchComentarios();
  }, [courseId]); // Recarrega quando o courseId mudar

  return (
    <div>
      <h3>Comentários</h3>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {comentarios.length > 0 ? (
          comentarios.map((comentario, index) => (
            <li key={index}>
              <strong>{comentario.usuario_nome}:</strong> {comentario.mensagem}
            </li>
          ))
        ) : (
          <p>Sem comentários para este curso.</p>
        )}
      </ul>
    </div>
  );
}

export default CourseComments;