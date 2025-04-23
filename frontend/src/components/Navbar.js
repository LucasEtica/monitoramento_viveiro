import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
// Se estiver usando ícones:
// import { FaHome, FaUsers, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-header">
        <Link to="/" className="nav-brand">
          {/* <FaHome className="nav-icon" /> */}
          Sistema de Monitoramento
        </Link>
        
        <div 
          className="menu-icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
          {/* Ou com ícones: {isMobileMenuOpen ? <FaTimes /> : <FaBars />} */}
        </div>
      </div>

      <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link 
          to="/cadastros" 
          className={`nav-link ${location.pathname === '/cadastros' ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* <FaUsers className="nav-icon" /> */}
          Cadastros
        </Link>
        
        {/* Adicione mais links conforme necessário */}
        {/* <Link to="/configuracoes" className="nav-link">Configurações</Link> */}
      </div>
    </nav>
  );
}

export default Navbar;