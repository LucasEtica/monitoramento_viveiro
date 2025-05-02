import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UsuarioForm.css'; // Importando o CSS separado

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      const carregarUsuario = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/usuarios/${id}`);
          setFormData({
            nome: response.data.nome,
            email: response.data.email,
            senha: ''
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    <div className="usuario-form-container">
      <h2 className="form-title">{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="usuario-form">
        <div className="form-group">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required={!isEdit}
            className="form-input"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/cadastros/usuarios')}
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