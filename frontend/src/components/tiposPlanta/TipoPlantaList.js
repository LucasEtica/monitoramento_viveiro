import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import '../../global.css';

function TipoPlantaList() {
  const [tipos, setTipos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viveiroId = searchParams.get('viveiro_id');

  useEffect(() => {
    carregarTipos();
  }, [viveiroId]);

  const carregarTipos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/tipos-planta');
      if (response.data.success) {
        let lista = response.data.data;
        if (viveiroId) {
          lista = lista.filter(tipo => String(tipo.viveiro_id) === viveiroId);
        }
        setTipos(lista);
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
    <div className="page-container">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o tipo <strong>{tipoToDelete?.titulo}</strong>?
              <br />Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn back-button">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-delete">
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Tipos de Planta</h2>
        <Link 
          to={`/cadastros/tipos-planta/novo${viveiroId ? `?viveiro_id=${viveiroId}` : ''}`} 
          className="btn btn-primary"
        >
          Novo Tipo de Planta
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Viveiro</th>
              <th>Status</th>
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
                  <td>{tipo.viveiro_nome || 'N/A'}</td>
                  <td>{tipo.inativo ? 'Inativo' : 'Ativo'}</td>
                  <td>
                    <Link to={`/cadastros/tipos-planta/${tipo.id}`} className="btn btn-sm btn-secondary">Ver</Link>
                    <Link to={`/cadastros/tipos-planta/${tipo.id}/editar`} className="btn btn-sm btn-edit">Editar</Link>
                    <button onClick={() => handleDeleteClick(tipo)} className="btn btn-sm btn-delete">Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Nenhum tipo de planta cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() =>
          navigate(
            viveiroId ? `/cadastros/viveiros/${viveiroId}` : '/cadastros'
          )
        }
        className="btn back-button"
      >
        {viveiroId ? 'Voltar para Viveiro' : 'Voltar para Cadastros'}
      </button>
    </div>
  );
}

export default TipoPlantaList;
