import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './TipoPlantaShow.css';

function TipoPlantaShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/tipos-planta/${id}`)
      .then(res => setTipo(res.data.data))
      .catch(() => setError('Erro ao carregar tipo de planta'));
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (!tipo) return <div className="loading">Carregando...</div>;

  return (
    <div className="tipo-show-container">
      <h2>Detalhes do Tipo de Planta</h2>
      <p><strong>ID:</strong> {tipo.id}</p>
      <p><strong>Título:</strong> {tipo.titulo}</p>
      <p><strong>Viveiro:</strong> {tipo.viveiro_nome || 'N/A'}</p>
      <p><strong>Status:</strong> {tipo.inativo ? 'Inativo' : 'Ativo'}</p>
      <Link to={`/cadastros/tipos-planta/${tipo.id}/editar`} className="btn btn-edit">Editar</Link>
      <button onClick={() => navigate('/cadastros/tipos-planta')} className="btn back-button">Voltar</button>
    </div>
  );
}

export default TipoPlantaShow;
