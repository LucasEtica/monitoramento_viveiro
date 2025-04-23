import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Importação separada
import api from '../../services/api';
import './ViveiroShow.css';

function ViveiroShow() {
  const { id } = useParams();
  const [viveiro, setViveiro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarViveiro = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/viveiros/${id}`);
        setViveiro(response.data.data);
      } catch (error) {
        console.error('Erro ao carregar viveiro:', error);
        setError('Falha ao carregar detalhes do viveiro');
      } finally {
        setIsLoading(false);
      }
    };

    carregarViveiro();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Carregando viveiro...</div>;
  }

  if (!viveiro) {
    return (
      <div className="not-found">
        <h2>Viveiro não encontrado</h2>
        <button 
          onClick={() => navigate('/cadastros/viveiros')} 
          className="btn back-button"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  return (
    <div className="viveiro-show-container">
      <div className="header-actions">
        <h2 className="page-title">Detalhes do Viveiro</h2>
        <div className="action-buttons">
          <Link 
            to={`/cadastros/viveiros/${viveiro.id}/editar`} 
            className="btn btn-edit"
          >
            Editar Viveiro
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="viveiro-details">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{viveiro.id}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Título:</span>
          <span className="detail-value">{viveiro.titulo}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Descrição:</span>
          <span className="detail-value">{viveiro.descricao || 'N/A'}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Responsável:</span>
          <span className="detail-value">
            {viveiro.usuario_nome || 'N/A'} (ID: {viveiro.usuario_id})
          </span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Data de Cadastro:</span>
          <span className="detail-value">
            {new Date(viveiro.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="footer-actions">
        <button 
          onClick={() => navigate('/cadastros/viveiros')} 
          className="btn back-button"
        >
          Voltar para Lista
        </button>
      </div>
    </div>
  );
}

export default ViveiroShow;