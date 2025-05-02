import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function TipoPlantaList() {
  const [tipos, setTipos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarTipos();
  }, []);

  const carregarTipos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/tipos-planta');
      if (response.data.success) {
        setTipos(response.data.data);
      } else {
        setError(response.data.error || 'Dados inesperados');
      }
    } catch (error) {
      console.error('Erro na requisição:', error.response || error);
      setError('Falha na conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (tipo) => {
    setTipoToDelete(tipo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!tipoToDelete) return;
    try {
      await api.delete(`/tipos-planta/${tipoToDelete.id}`);
      carregarTipos();
      setError(null);
    } catch (error) {
      console.error('Erro ao deletar tipo de planta:', error);
      setError('Falha ao excluir tipo de planta');
    } finally {
      setShowDeleteModal(false);
      setTipoToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="loading">Carregando tipos de planta...</div>;
  }

  return (
    <div className="viveiro-list-container">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o tipo <strong>{tipoToDelete?.titulo}</strong>?
              <br />Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-cancel">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-confirm-delete">
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Tipos de Planta</h2>
        <Link to="/cadastros/tipos-planta/novo" className="btn btn-primary">
          Novo Tipo de Planta
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="viveiro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tipos.length > 0 ? (
              tipos.map((tipo) => (
                <tr key={tipo.id}>
                  <td>{tipo.id}</td>
                  <td>{tipo.titulo}</td>
                  <td>{tipo.descricao || 'N/A'}</td>
                  <td className="actions-cell">
                    <Link to={`/cadastros/tipos-planta/${tipo.id}`} className="btn btn-sm btn-view">
                      Ver
                    </Link>
                    <Link to={`/cadastros/tipos-planta/${tipo.id}/editar`} className="btn btn-sm btn-edit">
                      Editar
                    </Link>
                    <button onClick={() => handleDeleteClick(tipo)} className="btn btn-sm btn-delete">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  Nenhum tipo de planta cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate('/cadastros')} className="btn back-button">
        Voltar para Cadastros
      </button>
    </div>
  );
}

export default TipoPlantaList;