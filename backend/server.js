const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Rotas
const usuariosRoutes = require('./routes/usuarios');
const viveirosRoutes = require('./routes/viveiros');
const tiposPlantaRoutes = require('./routes/tiposPlanta');
const tiposFertilizanteRoutes = require('./routes/tiposFertilizante');
const tiposPesticidaRoutes = require('./routes/tiposPesticida');

// Inicialização dos Models
const { initializeDatabase: initUsuarios } = require('./models/usuarioModel');
const { initializeDatabase: initViveiros } = require('./models/viveiroModel');
const { initializeDatabase: initTiposPlanta } = require('./models/tipoPlantaModel');
const { initializeDatabase: initTiposFertilizante } = require('./models/tipoFertilizanteModel');
const { initializeDatabase: initTiposPesticida } = require('./models/tipoPesticidaModel');

dotenv.config();

// 1. Primeiro cria a instância do Express
const app = express();

// 2. Configura middlewares
app.use(cors());
app.use(express.json());

// 3. Função de inicialização ordenada
async function startServer() {
  try {
    //  Inicializando tabelas.
    await initUsuarios();
    await initViveiros();
    await initTiposPlanta();
    await initTiposFertilizante();
    await initTiposPesticida();
    
    // 4. Configura rotas APÓS a inicialização do banco
    app.use('/api/usuarios', usuariosRoutes);
    app.use('/api/viveiros', viveirosRoutes);
    app.use('/api/tipos-planta', tiposPlantaRoutes);
    app.use('/api/tipos-fertilizante', tiposFertilizanteRoutes);
    app.use('/api/tipos-pesticida', tiposPesticidaRoutes);

    const PORT = process.env.PORT || 5000;
    
    // 5. Inicia o servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
    
  } catch (err) {
    console.error('❌ Falha na inicialização:', err);
    process.exit(1);
  }
}

// 6. Inicia o processo
startServer();
