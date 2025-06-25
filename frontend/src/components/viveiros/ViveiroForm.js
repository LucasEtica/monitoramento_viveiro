import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function ViveiroForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    usuario_id: usuarioLogado.usuario.admin ? '' : usuarioLogado.usuario.id
  });
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        if (usuarioLogado.usuario.admin) {
          const usuariosResponse = await api.get('/usuarios');
          setUsuarios(usuariosResponse.data);
        }

        if (id && id !== 'novo') {
          const viveiroResponse = await api.get(`/viveiros/${id}`);
          setFormData(viveiroResponse.data.data);
        }
      } catch (err) {
        setError('Falha ao carregar dados');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (id && id !== 'novo') {
        response = await api.put(`/viveiros/${id}`, formData);
      } else {
        response = await api.post('/viveiros', formData);
      }

      if (response.status >= 200 && response.status < 300) {
        setSuccess(id ? 'Viveiro atualizado com sucesso!' : 'Viveiro criado com sucesso!');
        setTimeout(() => {
          navigate('/cadastros/viveiros');
        }, 1500);
      } else {
        throw new Error(`Resposta inesperada: ${response.status}`);
      }
    } catch (err) {
      console.error('Erro completo:', err);
      const errorMessage = err.response?.data?.error || 'Erro ao salvar viveiro';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-header">
        <h2>🌱 {id ? 'Editar Viveiro' : 'Novo Viveiro'}</h2>
      </div>

      {error && <div className="error-message"><strong>Erro:</strong> {error}</div>}
      {success && <div className="success-message"><strong>Sucesso!</strong> {success}</div>}

      <form onSubmit={handleSubmit} className="viveiro-form">
        <div className="form-group">
          <label htmlFor="titulo">Título*</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="4"
            disabled={isLoading}
          />
        </div>

        {usuarioLogado.usuario.admin && (
          <div className="form-group">
            <label htmlFor="usuario_id">Responsável*</label>
            <select
              id="usuario_id"
              name="usuario_id"
              value={formData.usuario_id}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Selecione um responsável</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} ({usuario.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate('/cadastros/viveiros')}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ViveiroForm;
