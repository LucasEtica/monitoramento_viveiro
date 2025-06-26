import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './TipoShow.css'; // CSS compartilhado para telas de "Show"

function TiposFertilizanteShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/tipos-fertilizante/${id}`)
      .then(res => setTipo(res.data.data))
      .catch(() => setError('Erro ao carregar tipo de fertilizante'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="loading">Carregando tipo de fertilizante...</div>;
  if (!tipo) return (
    <div className="tipo-show-container">
      <div className="error-message">Tipo de fertilizante não encontrado.</div>
      <button className="btn btn-secondary" onClick={() => navigate('/cadastros/tipos-fertilizante')}>Voltar</button>
    </div>
  );

  return (
    <div className="tipo-show-container">
      <div className="header-actions">
        <h2>Detalhes do Tipo de Fertilizante</h2>
        <div className="action-buttons">
          <Link to={`/cadastros/tipos-fertilizante/${tipo.id}/editar`} className="btn btn-primary">Editar</Link>
          <button onClick={() => navigate('/cadastros/tipos-fertilizante')} className="btn btn-secondary">Voltar</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tipo-detalhes">
        <p><strong>ID:</strong> {tipo.id}</p>
        <p><strong>Título:</strong> {tipo.titulo}</p>
        <p><strong>Descrição:</strong> {tipo.descricao || '—'}</p>
        <p><strong>Viveiro:</strong> {tipo.viveiro_nome || '—'}</p>
        <p><strong>Status:</strong> {tipo.inativo ? 'Inativo' : 'Ativo'}</p>
        <p><strong>Criado em:</strong> {new Date(tipo.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default TiposFertilizanteShow;
