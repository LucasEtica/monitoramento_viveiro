import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  return (
    <nav style={{
      background: 'var(--verde-principal)',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      borderRadius: '0 0 12px 12px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={{
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}>
          🌿 Monitoramento de Viveiro
        </Link>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'none'
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {usuarioLogado && (
        <div style={{
          display: isMobileMenuOpen ? 'block' : 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: isMobileMenuOpen ? '12px' : '0',
        }}>
          <span style={{ fontWeight: 500 }}>
            Bem-vindo,&nbsp;
            <Link 
              to={`/cadastros/usuarios/${usuarioLogado.usuario.id}`} 
              style={{ color: 'white', textDecoration: 'underline' }}
            >
              {usuarioLogado.usuario.nome}
            </Link>
          </span>

          <button 
            onClick={handleLogout} 
            className="btn btn-delete"
            style={{ backgroundColor: 'white', color: 'var(--verde-principal)' }}
          >
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
