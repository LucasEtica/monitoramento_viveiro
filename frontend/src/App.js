import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CadastrosPage from './components/cadastros/CadastrosPage';
import UsuarioList from './components/usuarios/UsuarioList';
import UsuarioShow from './components/usuarios/UsuarioShow';
import UsuarioForm from './components/usuarios/UsuarioForm';
import ViveiroList from './components/viveiros/ViveiroList';
import ViveiroShow from './components/viveiros/ViveiroShow';
import ViveiroForm from './components/viveiros/ViveiroForm';
import Navbar from './components/Navbar';
import TipoPlantaList from './components/tiposPlanta/TipoPlantaList'
import TipoPlantaForm from './components/tiposPlanta/TipoPlantaForm'
import TipoPlantaShow from './components/tiposPlanta/TipoPlantaShow'
import TipoFertilizanteList from './components/tiposFertilizante/TipoFertilizanteList';
import TiposFertilizanteForm from './components/tiposFertilizante/TipoFertilizanteForm';
import TiposFertilizanteShow from './components/tiposFertilizante/TipoFertilizanteShow';
import TiposPesticidaList from './components/tipoPesticida/TiposPesticidaList';
import TiposPesticidaForm from './components/tipoPesticida/TiposPesticidaForm';
import TiposPesticidaShow from './components/tipoPesticida/TiposPesticidaShow';

import MovimentacaoList from './components/movimentacoes/MovimentacaoList';
import MovimentacaoForm from './components/movimentacoes/MovimentacaoForm';

import EventosList from './components/eventos/EventosList';
import EventosForm from './components/eventos/EventosForm';

import Login from './components/Login'; // Tela de login
import ProtectedRoute from './ProtectedRoute'; // Componente para proteger rotas

import './global.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />



      <Routes>

      <Route path="/cadastros/tipos-pesticida" element={<ProtectedRoute><TiposPesticidaList /></ProtectedRoute>} />
      <Route path="/cadastros/tipos-pesticida/novo" element={<ProtectedRoute><TiposPesticidaForm /></ProtectedRoute>} />
      <Route path="/cadastros/tipos-pesticida/:id" element={<ProtectedRoute><TiposPesticidaShow /></ProtectedRoute>} />
      <Route path="/cadastros/tipos-pesticida/:id/editar" element={<ProtectedRoute><TiposPesticidaForm /></ProtectedRoute>} />

        <Route path="/cadastros/tipos-planta" element={<ProtectedRoute><TipoPlantaList /></ProtectedRoute>} />
        <Route path="/cadastros/tipos-planta/novo" element={<ProtectedRoute><TipoPlantaForm /></ProtectedRoute>} />
        <Route path="/cadastros/tipos-planta/:id" element={<ProtectedRoute><TipoPlantaShow /></ProtectedRoute>} />
        <Route path="/cadastros/tipos-planta/:id/editar" element={<ProtectedRoute><TipoPlantaForm /></ProtectedRoute>} />

         {/* Tipos de Fertilizante */}
         <Route path="/cadastros/tipos-fertilizante" element={<ProtectedRoute><TipoFertilizanteList /></ProtectedRoute>} />
        <Route path="/cadastros/tipos-fertilizante/novo" element={<ProtectedRoute><TiposFertilizanteForm /></ProtectedRoute>} />
        <Route path="/cadastros/tipos-fertilizante/:id" element={<ProtectedRoute><TiposFertilizanteShow /></ProtectedRoute>} />
        <Route path="/cadastros/tipos-fertilizante/:id/editar" element={<ProtectedRoute><TiposFertilizanteForm /></ProtectedRoute>} />


        {/* Rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota protegida da home de cadastros */}
        <Route path="/cadastros" element={
          <ProtectedRoute>
            <CadastrosPage />
          </ProtectedRoute>
        } />

        {/* Rotas protegidas de Usuários */}
        <Route path="/cadastros/usuarios" element={
          <ProtectedRoute>
            <UsuarioList />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/usuarios/novo" element={
          <UsuarioForm />
        } />
        <Route path="/cadastros/usuarios/:id" element={
          <ProtectedRoute>
            <UsuarioShow />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/usuarios/:id/editar" element={
          <ProtectedRoute>
            <UsuarioForm />
          </ProtectedRoute>
        } />

        {/* Rotas protegidas de Viveiros */}
        <Route path="/cadastros/viveiros" element={
          <ProtectedRoute>
            <ViveiroList />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/viveiros/novo" element={
          <ProtectedRoute>
            <ViveiroForm />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/viveiros/:id" element={
          <ProtectedRoute>
            <ViveiroShow />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/viveiros/:id/editar" element={
          <ProtectedRoute>
            <ViveiroForm />
          </ProtectedRoute>
        } />

        <Route path="/cadastros/movimentacoes" element={
          <ProtectedRoute>
            <MovimentacaoList />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/movimentacoes/nova" element={
          <ProtectedRoute>
            <MovimentacaoForm />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/eventos" element={
          <ProtectedRoute>
            <EventosList />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/eventos/novo" element={
          <ProtectedRoute>
            <EventosForm />
          </ProtectedRoute>
        } />
        <Route path="/cadastros/eventos/:id/editar" element={
          <ProtectedRoute>
            <EventosForm />
          </ProtectedRoute>
        } />
        {/* Redirecionamento padrão para /cadastros */}
        <Route path="/" element={<Navigate to="/cadastros" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
