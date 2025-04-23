const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const viveirosRoutes = require('./routes/viveiros');
const { initializeDatabase: initUsuarios } = require('./models/usuarioModel');
const { initializeDatabase: initViveiros } = require('./models/viveiroModel');

dotenv.config();

// 1. Primeiro cria a instância do Express
const app = express();

// 2. Configura middlewares
app.use(cors());
app.use(express.json());

// 3. Função de inicialização ordenada
async function startServer() {
  try {
    // console.log('🔄 Inicializando tabelas...');
    await initUsuarios();
    await initViveiros();
    
    // 4. Configura rotas APÓS a inicialização do banco
    app.use('/api/usuarios', usuariosRoutes);
    app.use('/api/viveiros', viveirosRoutes);

    const PORT = process.env.PORT || 5000;
    
    // 5. Inicia o servidor
    app.listen(PORT, () => {
      //(`✅ Servidor rodando na porta ${PORT}`);
      //console.log('➡️ Rotas disponíveis:');
      //console.log(`   - http://localhost:${PORT}/api/usuarios`);
      //console.log(`   - http://localhost:${PORT}/api/viveiros`);
    });
    
  } catch (err) {
    console.error('❌ Falha na inicialização:', err);
    process.exit(1);
  }
}

// 6. Inicia o processo
startServer();