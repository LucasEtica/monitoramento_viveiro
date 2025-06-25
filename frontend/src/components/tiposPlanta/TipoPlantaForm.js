import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function TipoPlantaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viveiroId = searchParams.get('viveiro_id');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    viveiro_id: viveiroId || '',
    inativo: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      api.get(`/tipos-planta/${id}`)
        .then(res => setFormData(res.data.data))
        .catch(() => setError('Erro ao carregar tipo de planta'));
    }
  }, [id]);

  const handleCancel = () => {
    if (formData.viveiro_id) {
      navigate(`/cadastros/viveiros/${formData.viveiro_id}`);
    } else {
      navigate('/cadastros/tipos-planta');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        viveiro_id: parseInt(formData.viveiro_id)
      };

      if (!payload.viveiro_id || isNaN(payload.viveiro_id)) {
        setError('Viveiro inválido. Tente novamente a partir da tela do viveiro.');
        setIsLoading(false);
        return;
      }

      const response = id && id !== 'novo'
        ? await api.put(`/tipos-planta/${id}`, payload)
        : await api.post('/tipos-planta', payload);

      if (response.status >= 200 && response.status < 300) {
        setSuccess('Tipo de planta salvo com sucesso!');
        setTimeout(() => navigate(`/cadastros/tipos-planta?viveiro_id=${formData.viveiro_id}`), 1500);
      }
    } catch {
      setError('Erro ao salvar tipo de planta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">{id && id !== 'novo' ? 'Editar' : 'Novo'} Tipo de Planta</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="titulo">Título*</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            rows="3"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              name="inativo"
              checked={formData.inativo}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Marcar como inativo
          </label>
        </div>

        <input type="hidden" name="viveiro_id" value={formData.viveiro_id} />

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando…' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TipoPlantaForm;
