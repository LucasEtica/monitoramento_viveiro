import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function TiposPesticidaShow() {
  const { id } = useParams();
  const [tipoPesticida, setTipoPesticida] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarTipo = async () => {
      try {
        const response = await api.get(`/tipos-pesticida/${id}`);
        setTipoPesticida(response.data);
      } catch (err) {
        setError('Erro ao carregar tipo de pesticida');
      } finally {
        setIsLoading(false);
      }
    };

    carregarTipo();
  }, [id]);

  if (isLoading) return <div className="loading">Carregando tipo...</div>;

  if (!tipoPesticida) {
    return (
      <div className="not-found">
        <h2>Tipo de pesticida não encontrado</h2>
        <button className="btn back-button" onClick={() => navigate('/cadastros/tipos-pesticida')}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="tipo-show-container">
      <div className="header-actions">
        <h2>Detalhes do Tipo de Pesticida</h2>
        <Link to={`/cadastros/tipos-pesticida/${tipoPesticida.id}/editar`} className="btn btn-edit">
          Editar
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tipo-detalhes">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{tipoPesticida.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Título:</span>
          <span className="detail-value">{tipoPesticida.titulo}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Descrição:</span>
          <span className="detail-value">{tipoPesticida.descricao || 'Sem descrição'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Criado em:</span>
          <span className="detail-value">
            {tipoPesticida.created_at
              ? new Date(tipoPesticida.created_at).toLocaleString()
              : '—'}
          </span>
        </div>
      </div>

      <button onClick={() => navigate('/cadastros/tipos-pesticida')} className="btn back-button">
        Voltar para Lista
      </button>
    </div>
  );
}

export default TiposPesticidaShow;
