import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ViveiroList.css';

function ViveiroList() {
  const [viveiros, setViveiros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viveiroToDelete, setViveiroToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarViveiros();
  }, []);

  const carregarViveiros = async () => {
    setIsLoading(true); // Inicia o loading
    setError(null); // Reseta erros anteriores
    //console.log('🔎 Iniciando carregarViveiros...');
    
    try {
      const response = await api.get('/viveiros');
      //console.log('🔄 Resposta da API:', response.data);
      
      if (response.data.success) {
        setViveiros(response.data.data);
      } else {
        setError(response.data.error || 'Dados inesperados');
      }
    } catch (error) {
      console.error('🚨 Erro na requisição:', error.response || error);
      setError('Falha na conexão com o servidor');
    } finally {
      setIsLoading(false); // Finaliza o loading em qualquer caso (sucesso ou erro)
    }
  };

  const handleDeleteClick = (viveiro) => {
    setViveiroToDelete(viveiro);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!viveiroToDelete) return;
    
    try {
      await api.delete(`/viveiros/${viveiroToDelete.id}`);
      carregarViveiros();
      setError(null);
    } catch (error) {
      console.error('Erro ao deletar viveiro:', error);
      setError('Falha ao excluir viveiro');
    } finally {
      setShowDeleteModal(false);
      setViveiroToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="loading">Carregando viveiros...</div>;
  }

  return (
    <div className="viveiro-list-container">
      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o viveiro <strong>{viveiroToDelete?.titulo}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
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
        <h2 className="page-title">Lista de Viveiros</h2>
        <Link to="/cadastros/viveiros/novo" className="btn btn-primary">
          Novo Viveiro
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="viveiro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Responsável</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {viveiros.length > 0 ? (
              viveiros.map((viveiro) => (
                <tr key={viveiro.id}>
                  <td>{viveiro.id}</td>
                  <td>{viveiro.titulo}</td>
                  <td>{viveiro.usuario_nome || 'N/A'}</td>
                  <td>{new Date(viveiro.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <Link 
                      to={`/cadastros/viveiros/${viveiro.id}`} 
                      className="btn btn-sm btn-view"
                    >
                      Ver
                    </Link>
                    <Link 
                      to={`/cadastros/viveiros/${viveiro.id}/editar`} 
                      className="btn btn-sm btn-edit"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(viveiro)}
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
                  Nenhum viveiro cadastrado
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

export default ViveiroList;