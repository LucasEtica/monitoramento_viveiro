// ViveiroShow.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './ViveiroShow.css';

function ViveiroShow() {
  const { id } = useParams();
  const [viveiro, setViveiro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = usuario?.usuario?.admin === true;

  const [somaCredito, setSomaCredito] = useState(0);
  const [somaDebito, setSomaDebito] = useState(0);
  const [eventosPendentes, setEventosPendentes] = useState([]);

  useEffect(() => {
    const carregarViveiro = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/viveiros/${id}`);
        setViveiro(response.data.data);
      } catch (err) {
        setError('Falha ao carregar detalhes do viveiro');
      } finally {
        setIsLoading(false);
      }
    };

    const carregarMovimentacoes = async () => {
      try {
        const response = await api.get(`/movimentacoes?viveiro_id=${id}`);
        const movimentacoes = response.data.data;

        let totalCredito = 0;
        let totalDebito = 0;

        movimentacoes.forEach((mov) => {
          const valor = parseFloat(mov.valor);
          if (mov.tipo_movimentacao === 'credito') totalCredito += valor;
          if (mov.tipo_movimentacao === 'debito') totalDebito += valor;
        });

        setSomaCredito(totalCredito);
        setSomaDebito(totalDebito);
      } catch (err) {
        console.error('Erro ao buscar movimentacoes:', err);
      }
    };

    const carregarEventos = async () => {
      try {
        const res = await api.get(`/eventos?viveiro_id=${id}`);
        const hoje = new Date().toISOString().split('T')[0];
        const pendentes = res.data.data.filter(e =>
          !e.lido && e.data_evento.split('T')[0] <= hoje
        );
        setEventosPendentes(pendentes);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
      }
    };

    carregarViveiro();
    carregarMovimentacoes();
    carregarEventos();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este viveiro?')) return;
    setDeleting(true);
    try {
      await api.delete(`/viveiros/${id}`);
      navigate('/cadastros/viveiros');
    } catch {
      alert('Erro ao excluir viveiro.');
    } finally {
      setDeleting(false);
    }
  };

  const confirmarEvento = async (eventoId) => {
    try {
      await api.put(`/eventos/${eventoId}`, { lido: true });
      setEventosPendentes(prev => prev.filter(e => e.id !== eventoId));
    } catch (err) {
      alert('Erro ao confirmar evento.');
    }
  };

  if (isLoading) return <div className="loading">Carregando viveiro...</div>;
  if (!viveiro) {
    return (
      <div className="not-found page-container">
        <h2>Viveiro não encontrado</h2>
        <button onClick={() => navigate('/cadastros/viveiros')} className="btn back-button">
          Voltar para Lista
        </button>
      </div>
    );
  }

  return (
    <div className="viveiro-show-container page-container">
      <div className="header-actions">
        <h2 className="page-title">Detalhes do Viveiro</h2>
        <div className="action-buttons">
          <Link to={`/cadastros/viveiros/${viveiro.id}/editar`} className="btn btn-primary">
            Editar Viveiro
          </Link>
          <button onClick={handleDelete} className="btn btn-delete" disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Excluir Viveiro'}
          </button>
        </div>
      </div>

      {eventosPendentes.length > 0 && (
        <div className="alert-warning">
          <h3>⚠️ Eventos pendentes!</h3>
          <ul>
            {eventosPendentes.map(ev => {
              const detalhes = [];
              if (ev.fertilizante_nome) detalhes.push(`Aplicação de Fertilizante: ${ev.fertilizante_nome}`);
              if (ev.pesticida_nome) detalhes.push(`Aplicação de Pesticida: ${ev.pesticida_nome}`);
              if (ev.irrigacao) detalhes.push('Irrigação programada');

              return (
                <li key={ev.id}>
                  <strong>{new Date(ev.data_evento).toLocaleDateString()}:</strong>
                  <ul>
                    {detalhes.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                  <button onClick={() => confirmarEvento(ev.id)} className="btn btn-primary btn-sm">
                    Confirmar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="viveiro-details">
        {isAdmin && (
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{viveiro.id}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Título:</span>
          <span className="detail-value">{viveiro.titulo}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Descrição:</span>
          <span className="detail-value">{viveiro.descricao || 'N/A'}</span>
        </div>

        {isAdmin && (
          <div className="detail-row">
            <span className="detail-label">Responsável:</span>
            <span className="detail-value">
              {viveiro.usuario_nome || 'N/A'} (ID: {viveiro.usuario_id})
            </span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Data de Cadastro:</span>
          <span className="detail-value">
            {new Date(viveiro.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="financeiro-resumo">
        <h3 className="section-title">Resumo Financeiro</h3>
        <div className="detail-row">
          <span className="detail-label">Total de Créditos (Entradas com custo):</span>
          <span className="detail-value">R$ {somaCredito.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total de Débitos (Saídas ou Vendas):</span>
          <span className="detail-value">R$ {somaDebito.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total financeiro:</span>
          <span
            className="detail-value"
            style={{ color: (somaDebito - somaCredito) >= 0 ? 'green' : 'red' }}
          >
            R$ {(somaDebito - somaCredito).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="footer-actions">
        <button onClick={() => navigate('/cadastros/viveiros')} className="btn back-button">
          Voltar para Lista
        </button>
      </div>

      <div className="related-access-section">
        <h3 className="section-title">Gerenciamento:</h3>
        <div className="related-links-grid">
          <Link to={`/cadastros/tipos-planta?viveiro_id=${viveiro.id}`} className="btn btn-secondary">
            Tipos de Planta
          </Link>
          <Link to={`/cadastros/tipos-fertilizante?viveiro_id=${viveiro.id}`} className="btn btn-secondary">
            Tipos de Fertilizante
          </Link>
          <Link to={`/cadastros/tipos-pesticida?viveiro_id=${viveiro.id}`} className="btn btn-secondary">
            Tipos de Pesticida
          </Link>
          <Link to={`/cadastros/movimentacoes?viveiro_id=${viveiro.id}`} className="btn btn-secondary">
            Movimentações
          </Link>
          <Link to={`/cadastros/eventos?viveiro_id=${viveiro.id}`} className="btn btn-secondary">
            Eventos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViveiroShow;
