import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UsuarioShow.css'; // Importando o CSS separado

function UsuarioShow() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuario = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/usuarios/${id}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setError('Falha ao carregar detalhes do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    carregarUsuario();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Carregando usuário...</div>;
  }

  if (!usuario) {
    return (
      <div className="not-found">
        <h2>Usuário não encontrado</h2>
        <button 
          onClick={() => navigate('/cadastros/usuarios')} 
          className="btn back-button"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  return (
    <div className="usuario-show-container">
      <div className="header-actions">
        <h2 className="page-title">Detalhes do Usuário</h2>
        <div className="action-buttons">
          <Link 
            to={`/cadastros/usuarios/${usuario.id}/editar`} 
            className="btn btn-edit"
          >
            Editar Usuário
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="usuario-details">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{usuario.id}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Nome:</span>
          <span className="detail-value">{usuario.nome}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{usuario.email}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Data de Cadastro:</span>
          <span className="detail-value">
            {new Date(usuario.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="footer-actions">
        <button 
          onClick={() =>
            JSON.parse(localStorage.getItem('usuario'))?.usuario.admin
              ? navigate('/cadastros/usuarios')
              : navigate('/cadastros')
          } 
          className="btn back-button"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default UsuarioShow;