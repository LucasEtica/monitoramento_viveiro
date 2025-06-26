import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function EventosForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = usuario?.usuario?.admin === true;

  const viveiroIdParam = searchParams.get('viveiro_id');
  const viveiroIdUsuario = usuario?.usuario?.viveiro_id;
  const viveiroInicial = viveiroIdParam || (isAdmin ? '' : viveiroIdUsuario) || '';

  const [formData, setFormData] = useState({
    viveiro_id: viveiroInicial,
    tipo_fertilizante_id: '',
    tipo_pesticida_id: '',
    irrigacao: false,
    data_evento: '',
    lido: false
  });

  const [marcarComoPendente, setMarcarComoPendente] = useState(false);
  const [viveiros, setViveiros] = useState([]);
  const [fertilizantes, setFertilizantes] = useState([]);
  const [pesticidas, setPesticidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      api.get(`/eventos/${id}`)
        .then(res => {
          setFormData(res.data.data);
          setMarcarComoPendente(false); // checkbox começa desmarcado
        })
        .catch(() => setErro('Erro ao carregar evento'));
    }

    if (isAdmin) {
      api.get('/viveiros', { params: { admin: true } })
        .then(res => setViveiros(res.data.data || []))
        .catch(() => setErro('Erro ao carregar viveiros'));
    }
  }, [id, isAdmin]);

  useEffect(() => {
    if (!formData.viveiro_id) return;
    api.get('/tipos-fertilizante', { params: { viveiro_id: formData.viveiro_id } })
      .then(res => setFertilizantes(res.data.data || []))
      .catch(() => setErro('Erro ao carregar fertilizantes'));
    api.get('/tipos-pesticida', { params: { viveiro_id: formData.viveiro_id } })
      .then(res => setPesticidas(res.data.data || []))
      .catch(() => setErro('Erro ao carregar pesticidas'));
  }, [formData.viveiro_id]);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        tipo_fertilizante_id: formData.tipo_fertilizante_id || null,
        tipo_pesticida_id: formData.tipo_pesticida_id || null
      };

      if (id && id !== 'novo') {
        if (marcarComoPendente) {
          payload.lido = false;
        }
        await api.put(`/eventos/${id}`, payload);
      } else {
        await api.post('/eventos', payload);
      }

      setSuccess('Evento salvo com sucesso!');
      setTimeout(() => {
        navigate(`/cadastros/eventos?viveiro_id=${formData.viveiro_id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setErro('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(formData.viveiro_id ? `/cadastros/viveiros/${formData.viveiro_id}` : '/cadastros/eventos');
  };

  return (
    <div className="page-container">
      <div className="form-header">
        <h2>{id && id !== 'novo' ? 'Editar' : 'Novo'} Evento</h2>
        <button className="btn back-button" onClick={handleCancel}>&larr; Voltar</button>
      </div>

      {erro && <div className="error-message"><strong>Erro:</strong> {erro}</div>}
      {success && <div className="success-message"><strong>Sucesso:</strong> {success}</div>}

      <form onSubmit={handleSubmit}>
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
              <option value="">Selecione</option>
              {viveiros.map(v => (
                <option key={v.id} value={v.id}>{v.titulo}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="data_evento">Data do Evento*</label>
          <input
            type="date"
            id="data_evento"
            name="data_evento"
            value={formData.data_evento?.split('T')[0] || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo_fertilizante_id">Fertilizante</label>
          <select
            id="tipo_fertilizante_id"
            name="tipo_fertilizante_id"
            value={formData.tipo_fertilizante_id || ''}
            onChange={handleChange}
          >
            <option value="">Nenhum</option>
            {fertilizantes.map(f => (
              <option key={f.id} value={f.id}>{f.titulo}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tipo_pesticida_id">Pesticida</label>
          <select
            id="tipo_pesticida_id"
            name="tipo_pesticida_id"
            value={formData.tipo_pesticida_id || ''}
            onChange={handleChange}
          >
            <option value="">Nenhum</option>
            {pesticidas.map(p => (
              <option key={p.id} value={p.id}>{p.titulo}</option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="irrigacao"
              checked={formData.irrigacao}
              onChange={handleChange}
            />
            Marcar irrigação
          </label>
        </div>

        {id && id !== 'novo' && (
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={marcarComoPendente}
                onChange={e => setMarcarComoPendente(e.target.checked)}
              />
              Marcar como pendente (não lido)
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando…' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventosForm;
