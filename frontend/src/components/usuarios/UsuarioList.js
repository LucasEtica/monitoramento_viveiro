import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UsuarioList.css';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Falha ao carregar lista de usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;
    
    try {
      await api.delete(`/usuarios/${usuarioToDelete.id}`);
      carregarUsuarios();
      setError(null);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      setError('Falha ao excluir usuário');
    } finally {
      setShowDeleteModal(false);
      setUsuarioToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUsuarioToDelete(null);
  };

  if (isLoading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  return (
    <div className="usuario-list-container">
      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o usuário <strong>{usuarioToDelete?.nome}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button 
                onClick={handleCancelDelete}
                className="btn btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="btn btn-confirm-delete"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Lista de Usuários</h2>
        <Link to="/cadastros/usuarios/novo" className="btn btn-primary">
          Novo Usuário
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="usuario-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{new Date(usuario.created_at).toLocaleString()}</td>
                  <td className="actions-cell">
                    <Link 
                      to={`/cadastros/usuarios/${usuario.id}`} 
                      className="btn btn-sm btn-view"
                    >
                      Ver
                    </Link>
                    <Link 
                      to={`/cadastros/usuarios/${usuario.id}/editar`} 
                      className="btn btn-sm btn-edit"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(usuario)}
                      className="btn btn-sm btn-delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  Nenhum usuário cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button 
        onClick={() => navigate('/cadastros')} 
        className="btn back-button"
      >
        Voltar para Cadastros
      </button>
    </div>
  );
}

export default UsuarioList;