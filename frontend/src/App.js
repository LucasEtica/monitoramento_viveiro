import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CadastrosPage from './components/cadastros/CadastrosPage';
import UsuarioList from './components/usuarios/UsuarioList';
import UsuarioShow from './components/usuarios/UsuarioShow';
import UsuarioForm from './components/usuarios/UsuarioForm';
import ViveiroList from './components/viveiros/ViveiroList';
import ViveiroShow from './components/viveiros/ViveiroShow';
import ViveiroForm from './components/viveiros/ViveiroForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/cadastros" element={<CadastrosPage />} />
        
        {/* Rotas de Usuários */}
        <Route path="/cadastros/usuarios" element={<UsuarioList />} />
        <Route path="/cadastros/usuarios/novo" element={<UsuarioForm />} />
        <Route path="/cadastros/usuarios/:id" element={<UsuarioShow />} />
        <Route path="/cadastros/usuarios/:id/editar" element={<UsuarioForm />} />
        
        {/* Novas Rotas de Viveiros */}
        <Route path="/cadastros/viveiros" element={<ViveiroList />} />
        <Route path="/cadastros/viveiros/novo" element={<ViveiroForm />} />
        <Route path="/cadastros/viveiros/:id" element={<ViveiroShow />} />
        <Route path="/cadastros/viveiros/:id/editar" element={<ViveiroForm />} />
        
        <Route path="/" element={<Navigate to="/cadastros" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;