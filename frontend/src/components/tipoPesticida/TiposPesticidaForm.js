import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function TiposPesticidaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ titulo: '', descricao: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      api.get(`/tipos-pesticida/${id}`)
        .then(response => setFormData(response.data))
        .catch(() => setError('Erro ao carregar tipo de pesticida'));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = id && id !== 'novo'
        ? await api.put(`/tipos-pesticida/${id}`, formData)
        : await api.post('/tipos-pesticida', formData);

      if (response.status >= 200 && response.status < 300) {
        setSuccess('Tipo de pesticida salvo com sucesso!');
        setTimeout(() => navigate('/cadastros/tipos-pesticida'), 1500);
      }
    } catch {
      setError('Erro ao salvar tipo de pesticida');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Editar' : 'Novo'} Tipo de Pesticida</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-cancel" onClick={() => navigate('/cadastros/tipos-pesticida')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TiposPesticidaForm;
