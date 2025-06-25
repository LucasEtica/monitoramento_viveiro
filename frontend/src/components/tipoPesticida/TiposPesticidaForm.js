import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function TiposPesticidaForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    viveiro_id: '',
    inativo: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);
  const [success,   setSuccess]   = useState(null);
  const [viveiros,  setViveiros]  = useState([]);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
  const isAdmin = usuarioLogado?.usuario?.admin === true;
  const viveiroIdFromURL = searchParams.get('viveiro_id');

  useEffect(() => {
    if (id && id !== 'novo') {
      api.get(`/tipos-pesticida/${id}`)
        .then(res => setFormData(res.data.data))
        .catch(() => setError('Erro ao carregar tipo de pesticida'));
    } else if (viveiroIdFromURL) {
      setFormData(prev => ({ ...prev, viveiro_id: viveiroIdFromURL }));
    }

    if (isAdmin) {
      api.get('/viveiros', { params: { admin: 'true' } })
        .then(res => {
          const ativos = (res.data.data ?? []).filter(v => !v.inativo);
          setViveiros(ativos);
        })
        .catch(() => setError('Erro ao carregar viveiros'));
    }
  }, [id, isAdmin, viveiroIdFromURL]);

  const handleCancel = () => {
    if (formData.viveiro_id) {
      navigate(`/cadastros/viveiros/${formData.viveiro_id}`);
    } else {
      navigate('/cadastros/tipos-pesticida');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = id && id !== 'novo'
        ? `/tipos-pesticida/${id}`
        : '/tipos-pesticida';

      const method = id && id !== 'novo' ? api.put : api.post;

      const payload = {
        ...formData,
        viveiro_id: parseInt(formData.viveiro_id)
      };

      await method(endpoint, payload);
      setSuccess('Tipo de pesticida salvo com sucesso!');
      setTimeout(() => {
        navigate(`/cadastros/tipos-pesticida?viveiro_id=${formData.viveiro_id}`);
      }, 1500);
    } catch {
      setError('Erro ao salvar tipo de pesticida');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-header">
        <h2>{id && id !== 'novo' ? 'Editar' : 'Novo'} Tipo de Pesticida</h2>
        <button className="btn btn-back" onClick={handleCancel}>&larr; Voltar</button>
      </div>

      {error && <div className="error-message"><strong>Erro:</strong> {error}</div>}
      {success && <div className="success-message"><strong>Sucesso!</strong> {success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título*</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ex: Pesticida Orgânico"
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
            placeholder="Informações adicionais sobre o pesticida..."
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
              disabled={!!viveiroIdFromURL}
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
              checked={formData.inativo}
              onChange={handleChange}
            />
            Marcar como inativo
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-cancel"
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

export default TiposPesticidaForm;
