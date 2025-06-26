import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function ViveiroList() {
  const [viveiros, setViveiros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [viveiroDel, setViveiroDel] = useState(null);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = usuario?.usuario?.admin === true;

  useEffect(() => {
    carregarViveiros();
  }, []);

  const carregarViveiros = async () => {
    setIsLoading(true);
    setError(null);

    const params = isAdmin
      ? { admin: 'true' }
      : { admin: 'false', usuario_id: usuario.usuario.id };

    try {
      const res = await api.get('/viveiros', { params });
      if (res.data.success) {
        setViveiros(res.data.data);
      } else {
        setError(res.data.error || 'Dados inesperados');
      }
    } catch (err) {
      setError('Falha na conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const pedirDelete = (v) => {
    setViveiroDel(v);
    setShowDelete(true);
  };

  const confirmarDelete = async () => {
    if (!viveiroDel) return;
    try {
      await api.delete(`/viveiros/${viveiroDel.id}`);
      carregarViveiros();
    } catch {
      setError('Viveiro não pode ser excluido, há movimentações ligadas ao item. (Acione o suporte)');
    } finally {
      setShowDelete(false);
      setViveiroDel(null);
    }
  };

  if (isLoading) return <div className="loading">Carregando viveiros...</div>;

  return (
    <div className="page-container">
      {showDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o viveiro <strong>{viveiroDel?.titulo}</strong>?</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowDelete(false)}>Cancelar</button>
              <button className="btn btn-confirm-delete" onClick={confirmarDelete}>Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', color: '#2e3d29' }}>🌿 Lista de Viveiros</h2>
        <Link to="/cadastros/viveiros/novo" className="btn btn-primary">
          + Novo Viveiro
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {viveiros.length > 0 ? (
          viveiros.map(viveiro => (
            <Link
              key={viveiro.id}
              to={`/cadastros/viveiros/${viveiro.id}`}
              style={{
                background: '#e9f5ee',
                border: '2px solid #c4e3d2',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,128,0,0.08)',
                padding: '24px',
                textDecoration: 'none',
                color: '#1f3e28',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,128,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,128,0,0.08)';
              }}
            >
              <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>🌱 {viveiro.titulo}</h3>
              {isAdmin && (
                <>
                  <p><strong>ID:</strong> {viveiro.id}</p>
                  <p><strong>Responsável:</strong> {viveiro.usuario_nome || 'N/A'}</p>
                  <p><strong>Criado em:</strong> {new Date(viveiro.created_at).toLocaleDateString()}</p>
                </>
              )}
            </Link>
          ))
        ) : (
          <p style={{ color: '#888' }}>Nenhum viveiro cadastrado</p>
        )}
      </div>

      <button
        onClick={() => navigate('/cadastros')}
        className="btn back-button"
        style={{ marginTop: '40px' }}
      >
        Voltar para Cadastros
      </button>
    </div>
  );
}

export default ViveiroList;
