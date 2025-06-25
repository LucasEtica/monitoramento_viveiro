// frontend/src/components/usuarios/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/usuarios/login', { email, senha });
      localStorage.setItem('usuario', JSON.stringify(res.data));
      navigate('/cadastros');
    } catch (err) {
      alert('Login inválido');
    }
  };

  const handleCadastroRedirect = () => {
    navigate('/cadastros/usuarios/novo');
  };

  return (
    <div className="page-container" style={{ maxWidth: 400, marginTop: 80 }}>
      <h2 className="page-title" style={{ textAlign: 'center' }}>Acesso ao Sistema</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Entrar</button>
        <button type="button" onClick={handleCadastroRedirect} className="btn btn-secondary">
          Não tem conta? Cadastre-se
        </button>
      </form>
    </div>
  );
}

export default Login;
