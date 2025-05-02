import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './TipoPlantaForm.css';

function TipoPlantaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ titulo: '', descricao: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      api.get(`/tipos-planta/${id}`)
        .then(res => setFormData(res.data.data))
        .catch(() => setError('Erro ao carregar tipo de planta'));
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

    try {
      if (id && id !== 'novo') {
        await api.put(`/tipos-planta/${id}`, formData);
      } else {
        await api.post('/tipos-planta', formData);
      }
      navigate('/cadastros/tipos-planta');
    } catch (err) {
      setError('Erro ao salvar tipo de planta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tipo-form-container">
      <h2>{id ? 'Editar' : 'Novo'} Tipo de Planta</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título*</label>
          <input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-cancel" onClick={() => navigate('/cadastros/tipos-planta')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TipoPlantaForm;
