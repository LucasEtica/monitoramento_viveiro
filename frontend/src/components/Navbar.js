import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <Link to="/" className="nav-brand">
          Sistema de Monitoramento
        </Link>
        
        <div 
          className="menu-icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </div>
      </div>

      <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        {usuarioLogado && (
          <>
            <span className="nav-user">Bem-vindo, <strong>{usuarioLogado.usuario.nome}</strong></span>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
