import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function TiposFertilizanteShow() {
  const { id } = useParams();
  const [tiposFertilizante, setTiposFertilizante] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarTipo = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/tipos-fertilizante/${id}`);
        setTiposFertilizante(response.data.data);
      } catch (err) {
        setError('Erro ao carregar tipo de fertilizante');
      } finally {
        setIsLoading(false);
      }
    };

    carregarTipo();
  }, [id]);

  if (isLoading) return <div className="loading">Carregando tipo...</div>;

  if (!tiposFertilizante) {
    return (
      <div className="not-found">
        <h2>Tipo de fertilizante não encontrado</h2>
        <button className="btn back-button" onClick={() => navigate('/cadastros/tipos-fertilizante')}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="tipo-show-container">
      <div className="header-actions">
        <h2>Detalhes do Tipo de Fertilizante</h2>
        <Link to={`/cadastros/tipos-fertilizante/${tiposFertilizante.id}/editar`} className="btn btn-edit">
          Editar
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tipo-detalhes">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{tiposFertilizante.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Título:</span>
          <span className="detail-value">{tiposFertilizante.titulo}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Descrição:</span>
          <span className="detail-value">{tiposFertilizante.descricao || 'Sem descrição'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Criado em:</span>
          <span className="detail-value">
            {new Date(tiposFertilizante.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <button onClick={() => navigate('/cadastros/tipos-fertilizante')} className="btn back-button">
        Voltar para Lista
      </button>
    </div>
  );
}

export default TiposFertilizanteShow;
