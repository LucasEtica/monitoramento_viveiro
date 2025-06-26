import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function TiposFertilizanteList() {
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
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      let url = '/tipos-fertilizante';
      if (viveiroId) url += `?viveiro_id=${viveiroId}`;
      const res = await api.get(url);
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
      await api.delete(`/tipos-fertilizante/${itemSelecionado.id}`);
      carregarDados();
    } catch {
      setErro('Tipo fertilizante não pode ser excluido, há movimentações ligadas ao item. (Acione o suporte)');
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
              Deseja realmente excluir <strong>{itemSelecionado?.titulo}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={() => setModal(false)} className="btn btn-secondary">Cancelar</button>
              <button onClick={confirmarExclusao} className="btn btn-delete">Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Tipos de Fertilizante</h2>
        <Link
          to={viveiroId ? `/cadastros/tipos-fertilizante/novo?viveiro_id=${viveiroId}` : '/cadastros/tipos-fertilizante/novo'}
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
                    <Link to={`/cadastros/tipos-fertilizante/${item.id}/editar`} className="btn btn-sm btn-edit">Editar</Link>
                    <button
                      onClick={() => {
                        setItemSelecionado(item);
                        setModal(true);
                      }}
                      className="btn btn-sm btn-delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Nenhum tipo de fertilizante cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate(viveiroId ? `/cadastros/viveiros/${viveiroId}` : '/cadastros')}
        className="btn back-button"
      >
        {viveiroId ? 'Voltar para Viveiro' : 'Voltar para Cadastros'}
      </button>
    </div>
  );
}

export default TiposFertilizanteList;
