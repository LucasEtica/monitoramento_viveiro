import React from 'react';
import { Link } from 'react-router-dom';
import './CadastrosPage.css';

function CadastrosPage() {
  return (
    <div className="cadastros-container">
      <div className="cadastros-header">
        <h1>Cadastros</h1>
        <p className="page-description">Gerencie os registros do sistema</p>
      </div>
      
      <div className="cadastro-cards">
        {/* Card de Usuários */}
        <Link to="/cadastros/usuarios" className="cadastro-card">
          <div className="card-icon user-icon">👥</div>
          <div className="card-content">
            <h2>Usuários</h2>
            <p>Gerencie os usuários do sistema</p>
            <span className="card-badge">Gerenciar &rarr;</span>
          </div>
        </Link>

        {/* Card de Viveiros */}
        <Link to="/cadastros/viveiros" className="cadastro-card">
          <div className="card-icon vivario-icon">🌿</div>
          <div className="card-content">
            <h2>Viveiros</h2>
            <p>Controle os viveiros da aplicação</p>
            <span className="card-badge">Gerenciar &rarr;</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CadastrosPage;