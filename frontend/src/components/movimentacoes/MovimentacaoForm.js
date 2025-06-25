import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './MovimentacaoForm.css';

function MovimentacaoForm () {
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = usuario?.usuario?.admin === 'admin';

  const viveiroIdParam = new URLSearchParams(location.search).get('viveiro_id');
  const viveiroIdUsuario = usuario?.usuario?.viveiro_id;
  const viveiroInicial = viveiroIdParam || (isAdmin ? '' : viveiroIdUsuario) || '';

  const [formData, setFormData] = useState({
    observacao: '',
    tipo_movimentacao: 'credito',
    viveiro_id: viveiroInicial,
    tipo_planta_id: '',
    tipo_fertilizante_id: '',
    tipo_pesticida_id: '',
    valor: '',
    quantidade: 1
  });

  const [viveiros, setViveiros] = useState([]);
  const [tiposPlanta, setTiposPlanta] = useState([]);
  const [tiposFertilizante, setTiposFertilizante] = useState([]);
  const [tiposPesticida, setTiposPesticida] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    api.get('/viveiros')
      .then(res => setViveiros(res.data.data ?? []))
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar viveiros');
      });
  }, [isAdmin]);

  useEffect(() => {
    if (!formData.viveiro_id) return;

    const params = { params: { viveiro_id: formData.viveiro_id } };
    Promise.all([
      api.get('/tipos-planta', params),
      api.get('/tipos-fertilizante', params),
      api.get('/tipos-pesticida', params)
    ])
      .then(([p, f, ps]) => {
        const viveiroIdStr = String(formData.viveiro_id);

        const plantasFiltradas = (p.data.data ?? []).filter(
          item => String(item.viveiro_id) === viveiroIdStr && !item.inativo
        );
        const fertsFiltrados = (f.data.data ?? []).filter(
          item => String(item.viveiro_id) === viveiroIdStr && !item.inativo
        );
        const pestsFiltrados = (ps.data.data ?? []).filter(
          item => String(item.viveiro_id) === viveiroIdStr && !item.inativo
        );

        setTiposPlanta(plantasFiltradas);
        setTiposFertilizante(fertsFiltrados);
        setTiposPesticida(pestsFiltrados);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar dados');
      });
  }, [formData.viveiro_id]);

  const handleCancel = () => {
    if (formData.viveiro_id) {
      navigate(`/cadastros/movimentacoes?viveiro_id=${formData.viveiro_id}`);
    } else {
      navigate('/cadastros/movimentacoes');
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'viveiro_id') {
      setFormData(prev => ({
        ...prev,
        viveiro_id: value,
        tipo_planta_id: '',
        tipo_fertilizante_id: '',
        tipo_pesticida_id: ''
      }));
      return;
    }

    if (name === 'tipo_planta_id') {
      setFormData(prev => ({
        ...prev,
        tipo_planta_id: value,
        tipo_fertilizante_id: '',
        tipo_pesticida_id: ''
      }));
      return;
    }

    if (name === 'tipo_fertilizante_id') {
      setFormData(prev => ({
        ...prev,
        tipo_planta_id: '',
        tipo_fertilizante_id: value,
        tipo_pesticida_id: ''
      }));
      return;
    }

    if (name === 'tipo_pesticida_id') {
      setFormData(prev => ({
        ...prev,
        tipo_planta_id: '',
        tipo_fertilizante_id: '',
        tipo_pesticida_id: value
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/movimentacoes', formData);
      setSuccess('Movimentação criada com sucesso!');
      setTimeout(() => navigate(`/cadastros/movimentacoes?viveiro_id=${formData.viveiro_id}`), 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao criar movimentação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="movimentacao-form-container">
      <div className="form-header">
        <h2>Nova Movimentação</h2>
        <button onClick={() => navigate('/cadastros')} className="btn btn-back">
          &larr; Voltar
        </button>
      </div>

      {error && <div className="error-message"><strong>Erro:</strong> {error}</div>}
      {success && <div className="success-message"><strong>Sucesso!</strong> {success}</div>}

      <form onSubmit={handleSubmit} className="movimentacao-form">
        <div className="form-row">
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

          <div className="form-group">
            <label htmlFor="tipo_movimentacao">Tipo*</label>
            <select
              id="tipo_movimentacao"
              name="tipo_movimentacao"
              value={formData.tipo_movimentacao}
              onChange={handleChange}
              required
            >
              <option value="credito">Crédito</option>
              <option value="debito">Débito</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo_planta_id">Tipo de Planta</label>
            <select
              id="tipo_planta_id"
              name="tipo_planta_id"
              value={formData.tipo_planta_id}
              onChange={handleChange}
            >
              <option value="">Nenhum</option>
              {tiposPlanta.map(p => (
                <option key={p.id} value={p.id}>{p.titulo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipo_fertilizante_id">Tipo de Fertilizante</label>
            <select
              id="tipo_fertilizante_id"
              name="tipo_fertilizante_id"
              value={formData.tipo_fertilizante_id}
              onChange={handleChange}
            >
              <option value="">Nenhum</option>
              {tiposFertilizante.map(f => (
                <option key={f.id} value={f.id}>{f.titulo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipo_pesticida_id">Tipo de Pesticida</label>
            <select
              id="tipo_pesticida_id"
              name="tipo_pesticida_id"
              value={formData.tipo_pesticida_id}
              onChange={handleChange}
            >
              <option value="">Nenhum</option>
              {tiposPesticida.map(p => (
                <option key={p.id} value={p.id}>{p.titulo}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantidade">Quantidade*</label>
            <input
              id="quantidade"
              type="number"
              name="quantidade"
              min="1"
              value={formData.quantidade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="valor">Valor (R$)*</label>
            <input
              id="valor"
              type="number"
              name="valor"
              step="0.01"
              value={formData.valor}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando…' : 'Salvar Movimentação'}
          </button>
          <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default MovimentacaoForm;
