import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function EventosList() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modal, setModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
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
      let url = '/eventos';
      if (viveiroId) url += `?viveiro_id=${viveiroId}`;
      const res = await api.get(url);
      if (res.data.success) {
        setEventos(res.data.data);
      } else {
        setErro(res.data.error || 'Erro ao buscar eventos');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao buscar eventos');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = async () => {
    try {
      await api.delete(`/eventos/${eventoSelecionado.id}`);
      carregarDados();
    } catch {
      setErro('Erro ao excluir evento');
    } finally {
      setModal(false);
    }
  };

  if (loading) return <div className="loading">Carregando eventos...</div>;

  return (
    <div className="page-container">
      {modal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Deseja realmente excluir o evento #{eventoSelecionado?.id}?</p>
            <div className="modal-actions">
              <button onClick={() => setModal(false)} className="btn btn-secondary">Cancelar</button>
              <button onClick={confirmarExclusao} className="btn btn-delete">Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Eventos</h2>
        <Link to={`/cadastros/eventos/novo${viveiroId ? `?viveiro_id=${viveiroId}` : ''}`} className="btn btn-primary">
          Novo Evento
        </Link>
      </div>

      {erro && <div className="error-message">{erro}</div>}

      <div className="table-responsive">
        <table className="default-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Viveiro</th>
              <th>Fertilizante</th>
              <th>Pesticida</th>
              <th>Irrigação</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length > 0 ? eventos.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.viveiro_nome || e.viveiro_id}</td>
                <td>{e.fertilizante_nome || '—'}</td>
                <td>{e.pesticida_nome || '—'}</td>
                <td>{e.irrigacao ? 'Sim' : 'Não'}</td>
                <td>{new Date(e.data_evento).toLocaleDateString()}</td>
                <td>{e.lido ? 'Lido' : 'Pendente'}</td>
                <td className="actions-cell">
                  <Link to={`/cadastros/eventos/${e.id}/editar`} className="btn btn-sm btn-edit">Editar</Link>
                  <button onClick={() => { setEventoSelecionado(e); setModal(true); }} className="btn btn-sm btn-delete">
                    Excluir
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" className="no-data">Nenhum evento encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate(viveiroId ? `/cadastros/viveiros/${viveiroId}` : '/cadastros')} className="btn back-button">
        Voltar
      </button>
    </div>
  );
}

export default EventosList;
