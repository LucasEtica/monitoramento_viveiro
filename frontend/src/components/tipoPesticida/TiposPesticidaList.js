import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function TiposPesticidaList() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modal, setModal] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viveiroId = searchParams.get('viveiro_id');

  useEffect(() => {
    carregarDados();
  }, [viveiroId]);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await api.get('/tipos-pesticida', {
        params: viveiroId ? { viveiro_id: viveiroId } : {},
      });

      if (res.data.success) {
        setDados(res.data.data);
      } else {
        setErro(res.data.error || 'Erro ao buscar dados');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = async () => {
    try {
      await api.delete(`/tipos-pesticida/${itemSelecionado.id}`);
      carregarDados();
    } catch {
      setErro('Erro ao excluir');
    } finally {
      setModal(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      {modal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir <strong>{itemSelecionado?.titulo}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={() => setModal(false)} className="btn btn-cancel">
                Cancelar
              </button>
              <button onClick={confirmarExclusao} className="btn btn-confirm-delete">
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Tipos de Pesticida</h2>
        <Link
          to={`/cadastros/tipos-pesticida/novo${viveiroId ? `?viveiro_id=${viveiroId}` : ''}`}
          className="btn btn-primary"
        >
          Novo Tipo
        </Link>
      </div>

      {erro && <div className="error-message">{erro}</div>}

      <div className="table-responsive">
        <table className="viveiro-table">
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
            {dados.length > 0 ? (
              dados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.titulo}</td>
                  <td>{item.descricao || '—'}</td>
                  <td>{item.viveiro_nome || '—'}</td>
                  <td>{item.inativo ? 'Inativo' : 'Ativo'}</td>
                  <td className="actions-cell">
                    <Link to={`/cadastros/tipos-pesticida/${item.id}`} className="btn btn-sm btn-view">Ver</Link>
                    <Link to={`/cadastros/tipos-pesticida/${item.id}/editar`} className="btn btn-sm btn-edit">Editar</Link>
                    <button onClick={() => { setItemSelecionado(item); setModal(true); }} className="btn btn-sm btn-delete">Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Nenhum tipo de pesticida cadastrado</td>
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

export default TiposPesticidaList;
