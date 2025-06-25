import React from 'react';
import { Link } from 'react-router-dom';

function CadastrosPage() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
  const usuario = usuarioLogado.usuario;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Cadastros</h1>
        <p className="page-description" style={{ color: '#666' }}>
          Gerencie os registros do sistema
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {/* Card de Usuários */}
        {usuario.admin && (
          <Link to="/cadastros/usuarios" style={cardStyle}>
            <div style={iconStyle}>👥</div>
            <h2 style={cardTitle}>Usuários</h2>
            <p>Gerencie os usuários do sistema</p>
            <span style={badgeStyle}>Gerenciar →</span>
          </Link>
        )}

        {/* Viveiros */}
        <Link
          to={`/cadastros/viveiros?admin=${usuario.admin ? 'true' : 'false'}${!usuario.admin ? `&usuario_id=${usuario.id}` : ''}`}
          style={cardStyle}
        >
          <div style={iconStyle}>🌿</div>
          <h2 style={cardTitle}>Viveiros</h2>
          <p>Controle os viveiros da aplicação</p>
          <span style={badgeStyle}>Gerenciar →</span>
        </Link>

        {/* Itens administrativos */}
        {usuario.admin && (
          <>
            <Link to="/cadastros/tipos-planta" style={cardStyle}>
              <div style={iconStyle}>🪴</div>
              <h2 style={cardTitle}>Tipos de Planta</h2>
              <p>Gerencie os tipos de planta cadastrados</p>
              <span style={badgeStyle}>Gerenciar →</span>
            </Link>

            <Link to="/cadastros/tipos-fertilizante" style={cardStyle}>
              <div style={iconStyle}>🧪</div>
              <h2 style={cardTitle}>Tipos de Fertilizante</h2>
              <p>Gerencie os tipos de fertilizantes</p>
              <span style={badgeStyle}>Gerenciar →</span>
            </Link>

            <Link to="/cadastros/tipos-pesticida" style={cardStyle}>
              <div style={iconStyle}>☠️</div>
              <h2 style={cardTitle}>Tipos de Pesticida</h2>
              <p>Gerencie os tipos de pesticidas</p>
              <span style={badgeStyle}>Gerenciar →</span>
            </Link>

            <Link to="/cadastros/movimentacoes" style={cardStyle}>
              <div style={iconStyle}>💸</div>
              <h2 style={cardTitle}>Movimentações</h2>
              <p>Cadastre entradas e saídas dos viveiros</p>
              <span style={badgeStyle}>Gerenciar →</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// ==== Estilos inline reaproveitáveis ====
const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  padding: '20px',
  textDecoration: 'none',
  color: '#333',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer'
};

const iconStyle = {
  fontSize: '2rem',
  marginBottom: '8px'
};

const cardTitle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--verde-principal)',
};

const badgeStyle = {
  marginTop: '8px',
  color: 'var(--verde-principal)',
  fontWeight: 500,
};

export default CadastrosPage;
