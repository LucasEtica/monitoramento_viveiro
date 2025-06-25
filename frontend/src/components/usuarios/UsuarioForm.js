import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    admin: false
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
  const isAdmin = usuarioLogado?.usuario?.admin === true;

  useEffect(() => {
    if (id && id !== 'novo') {
      const carregarUsuario = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/usuarios/${id}`);
          setFormData({
            nome: response.data.nome,
            email: response.data.email,
            senha: '',
            admin: response.data.admin || false
          });
          setIsEdit(true);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          setError('Falha ao carregar usuário');
        } finally {
          setIsLoading(false);
        }
      };
      carregarUsuario();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await api.put(`/usuarios/${id}`, formData);
      } else {
        await api.post('/usuarios', formData);
      }
      navigate('/cadastros/usuarios');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setError(error.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: 500 }}>
      <h2 className="page-title">{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label className="form-label">Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="form-label">Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required={!isEdit}
          />
        </div>
        {usuarioLogado && isAdmin && (
          <div>
            <label className="form-label">
              <input
                type="checkbox"
                name="admin"
                checked={formData.admin}
                onChange={handleChange}
              />{' '}
              Administrador
            </label>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate(isAdmin ? '/cadastros/usuarios' : '/cadastros')}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuarioForm;
