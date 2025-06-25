import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './MovimentacaoList.css';

function MovimentacaoList() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [viveiros, setViveiros] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [fertilizantes, setFertilizantes] = useState([]);
  const [pesticidas, setPesticidas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroViveiro, setFiltroViveiro] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroPlanta, setFiltroPlanta] = useState('');
  const [filtroFertilizante, setFiltroFertilizante] = useState('');
  const [filtroPesticida, setFiltroPesticida] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movToDelete, setMovToDelete] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viveiroIdURL = searchParams.get('viveiro_id');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = usuario?.usuario?.admin === true;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);

    if (viveiroIdURL) {
      const [resPlantas, resFertilizantes, resPesticidas] = await Promise.all([
        api.get('/tipos-planta'),
        api.get('/tipos-fertilizante', { params: { viveiro_id: viveiroIdURL } }),
        api.get('/tipos-pesticida', { params: { viveiro_id: viveiroIdURL } }),
      ]);

      const plantasFiltradas = (resPlantas.data.data || []).filter(
        (planta) => String(planta.viveiro_id) === String(viveiroIdURL)
      );

      setPlantas(plantasFiltradas || []);
      setFertilizantes(resFertilizantes.data.data || []);
      setPesticidas(resPesticidas.data.data || []);
    }

    try {
      const usuarioId = usuario?.usuario?.id;

      const vivesRes = await api.get('/viveiros', isAdmin
        ? { params: { admin: 'true' } }
        : { params: { usuario_id: usuarioId } });

      const movsRes = await api.get('/movimentacoes', {
        params: viveiroIdURL ? { viveiro_id: viveiroIdURL } : {},
      });

      let movs = movsRes.data.data || [];
      if (!isAdmin && viveiroIdURL) {
        movs = movs.filter(m => String(m.viveiro_id) === viveiroIdURL);
      }

      setMovimentacoes(movs);
      setViveiros(vivesRes.data.data || []);
    } catch (err) {
      setError('Erro ao carregar movimentações ou viveiros');
    } finally {
      setIsLoading(false);
    }
  };

  const pedirExclusao = (mov) => {
    setMovToDelete(mov);
    setShowDeleteModal(true);
  };

  const confirmarExclusao = async () => {
    if (!movToDelete) return;
    try {
      await api.delete(`/movimentacoes/${movToDelete.id}`);
      setError(null);
      carregarDados();
    } catch {
      setError('Falha ao excluir movimentação');
    } finally {
      setShowDeleteModal(false);
      setMovToDelete(null);
    }
  };

  const filtradas = movimentacoes.filter((m) => {
    const tipoOk = !filtroTipo || m.tipo_movimentacao === filtroTipo;
    const viveiroOk = !filtroViveiro || m.viveiro_id === parseInt(filtroViveiro);
    const dataMov = new Date(m.created_at);
    const dataIniOk = !filtroDataInicio || dataMov >= new Date(filtroDataInicio);
    const dataFimOk = !filtroDataFim || dataMov <= new Date(filtroDataFim);
    const plantaOk = !filtroPlanta || String(m.tipo_planta_id) === filtroPlanta;
    const fertOk = !filtroFertilizante || String(m.tipo_fertilizante_id) === filtroFertilizante;
    const pestOk = !filtroPesticida || String(m.tipo_pesticida_id) === filtroPesticida;

    return tipoOk && viveiroOk && dataIniOk && dataFimOk && plantaOk && fertOk && pestOk;
  });

  const gerarPDF = () => {
    const doc = new jsPDF();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
    const nomeUsuario = usuarioLogado?.usuario?.nome || 'Usuário desconhecido';
    const viveiroSelecionado = viveiros.find(v => String(v.id) === String(viveiroIdURL));
    const nomeViveiro = viveiroSelecionado?.titulo || 'Viveiro desconhecido';
    const descViveiro = viveiroSelecionado?.descricao || 'Sem descrição';
    const dataHora = new Date().toLocaleString('pt-BR');

    doc.setFontSize(16);
    doc.text('Relatório de Movimentações', 14, 15);
    doc.setFontSize(10);
    doc.text(`Viveiro: ${nomeViveiro}`, 14, 23);
    doc.text(`Descrição: ${descViveiro}`, 14, 29);
    doc.text(`Emitido por: ${nomeUsuario}`, 14, 35);
    doc.text(`Data/Hora: ${dataHora}`, 14, 41);

    autoTable(doc, {
      startY: 50,
      head: [['ID', 'Tipo', 'Item', 'Qtd', 'Valor (R$)', 'Data']],
      body: filtradas.map(m => [
        m.id,
        m.tipo_movimentacao,
        m.planta_nome || m.fertilizante_nome || m.pesticida_nome || '—',
        m.quantidade,
        Number(m.valor).toFixed(2),
        new Date(m.created_at).toLocaleDateString(),
      ]),
    });

    doc.save(`relatorio_movimentacoes_${nomeViveiro.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="movimentacao-list-container">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir a movimentação <strong>#{movToDelete?.id}</strong>?</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn btn-confirm-delete" onClick={confirmarExclusao}>Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        <h2 className="page-title">Movimentações</h2>
        <div className="header-buttons">
          <button className="btn btn-secondary" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
            {mostrarFiltros ? 'Ocultar Filtros ▲' : 'Mostrar Filtros ▼'}
          </button>
          <Link to={`/cadastros/movimentacoes/nova${viveiroIdURL ? `?viveiro_id=${viveiroIdURL}` : ''}`} className="btn btn-primary">
            Nova Movimentação
          </Link>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="filtros-container">
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="">Tipo</option>
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
          </select>

          <select value={filtroViveiro} onChange={e => setFiltroViveiro(e.target.value)}>
            <option value="">Viveiro</option>
            {viveiros.map(v => <option key={v.id} value={v.id}>{v.titulo}</option>)}
          </select>

          <input type="date" value={filtroDataInicio} onChange={e => setFiltroDataInicio(e.target.value)} />
          <input type="date" value={filtroDataFim} onChange={e => setFiltroDataFim(e.target.value)} />

          <select value={filtroPlanta} onChange={e => setFiltroPlanta(e.target.value)}>
            <option value="">Planta</option>
            {plantas.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
          </select>

          <select value={filtroFertilizante} onChange={e => setFiltroFertilizante(e.target.value)}>
            <option value="">Fertilizante</option>
            {fertilizantes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
          </select>

          <select value={filtroPesticida} onChange={e => setFiltroPesticida(e.target.value)}>
            <option value="">Pesticida</option>
            {pesticidas.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
          </select>

          <button className="btn btn-secondary" onClick={gerarPDF}>Exportar PDF</button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Carregando movimentações...</div>
      ) : (
        <div className="table-responsive">
          <table className="default-table">
            <thead>
              <tr>
                {isAdmin && <th>ID</th>}
                <th>Viveiro</th>
                <th>Tipo</th>
                <th>Relação</th>
                <th>Item</th>
                <th>Valor (R$)</th>
                <th>Quantidade</th>
                <th>Data</th>
                {isAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filtradas.length > 0 ? filtradas.map(mov => {
                const relacao = mov.tipo_planta_id ? 'Planta'
                  : mov.tipo_fertilizante_id ? 'Fertilizante'
                  : mov.tipo_pesticida_id ? 'Pesticida' : '—';

                const nomeItem = mov.planta_nome || mov.fertilizante_nome || mov.pesticida_nome || '—';

                return (
                  <tr key={mov.id}>
                    {isAdmin && <td>{mov.id}</td>}
                    <td>{mov.viveiro_nome || mov.viveiro_id}</td>
                    <td>{mov.tipo_movimentacao}</td>
                    <td>{relacao}</td>
                    <td>{nomeItem}</td>
                    <td>{Number(mov.valor).toFixed(2)}</td>
                    <td>{mov.quantidade}</td>
                    <td>{new Date(mov.created_at).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td className="actions-cell">
                        <button className="btn btn-sm btn-delete" onClick={() => pedirExclusao(mov)}>Excluir</button>
                      </td>
                    )}
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="no-data">Nenhuma movimentação encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn back-button" onClick={() => navigate(viveiroIdURL ? `/cadastros/viveiros/${viveiroIdURL}` : '/cadastros')}>
        Voltar
      </button>
    </div>
  );
}

export default MovimentacaoList;
