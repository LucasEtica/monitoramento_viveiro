import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function TiposFertilizanteForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
  const isAdmin = usuarioLogado?.usuario?.admin === true;

  const [viveiros, setViveiros] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    viveiro_id: searchParams.get('viveiro_id') || '',
    inativo: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      api.get(`/tipos-fertilizante/${id}`)
        .then(res => {
          const data = res.data.data;
          data.inativo = !!data.inativo;
          setFormData(data);
        })
        .catch(() => setError('Erro ao carregar tipo de fertilizante'));
    }

    if (isAdmin) {
      api.get('/viveiros', { params: { admin: 'true' } })
        .then(res => setViveiros(res.data.data ?? []))
        .catch(() => setError('Erro ao carregar viveiros'));
    }
  }, [id, isAdmin]);

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
      const endpoint = id && id !== 'novo'
        ? `/tipos-fertilizante/${id}`
        : '/tipos-fertilizante';
      const method = id && id !== 'novo' ? api.put : api.post;

      const payload = { ...formData, viveiro_id: parseInt(formData.viveiro_id) };

      await method(endpoint, payload);
      setSuccess('Tipo de fertilizante salvo com sucesso!');

      setTimeout(() => {
        if (payload.viveiro_id) {
          navigate(`/cadastros/tipos-fertilizante?viveiro_id=${formData.viveiro_id}`);
        } else {
          navigate('/cadastros/tipos-fertilizante');
        }
      }, 1500);
    } catch {
      setError('Erro ao salvar tipo de fertilizante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.viveiro_id) {
      navigate(`/cadastros/viveiros/${formData.viveiro_id}`);
    } else {
      navigate('/cadastros/tipos-fertilizante');
    }
  };

  return (
    <div className="page-container">
      <div className="form-header">
        <h2>{id && id !== 'novo' ? 'Editar' : 'Novo'} Tipo de Fertilizante</h2>
        <button className="btn back-button" onClick={handleCancel}>&larr; Voltar</button>
      </div>

      {error && <div className="error-message"><strong>Erro:</strong> {error}</div>}
      {success && <div className="success-message"><strong>Sucesso:</strong> {success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título*</label>
          <input
            id="titulo"
            name="titulo"
            value={formData.titulo}
            type="text"
            onChange={handleChange}
            required
            placeholder="Ex: Fertilizante Orgânico"
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
            placeholder="Informações adicionais sobre o fertilizante..."
          />
        </div>

        {isAdmin && (
          <div className="form-group">
            <label htmlFor="viveiro_id">Viveiro*</label>
            <select
              id="viveiro_id"
              name="viveiro_id"
              value={formData.viveiro_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um viveiro</option>
              {viveiros.map(v => (
                <option key={v.id} value={v.id}>{v.titulo}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="inativo"
              checked={!!formData.inativo}
              onChange={handleChange}
            />
            Marcar como inativo
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando…' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TiposFertilizanteForm;
