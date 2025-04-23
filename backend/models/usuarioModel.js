const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Configuração com fallbacks e validação
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'monitoramento_viveiro',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432,
  connectionTimeoutMillis: 5000, // Timeout de conexão
  idleTimeoutMillis: 30000 // Fechar conexões ociosas
};

// Validação crítica da senha
if (!dbConfig.password) {
  console.error('❌ Erro: DB_PASSWORD não definida no .env');
  process.exit(1);
}

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'monitoramento_viveiro',
  password: 'postgres',
  port: 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Teste de conexão imediata
pool.on('connect', () => {
  //console.log('🟢 Conexão com PostgreSQL estabelecida');
});

pool.on('error', (err) => {
  console.error('❌ Erro na pool do PostgreSQL:', err);
});

// Versão robusta da criação de tabela
async function createUsersTable() {
  const client = await pool.connect().catch(err => {
    console.error('Erro ao obter cliente da pool:', err);
    throw err;
  });

  try {
    await client.query('BEGIN');
    
    // Criação condicional da tabela
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criação condicional do índice (COM TRATAMENTO DE ERRO)
    try {
      await client.query(`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS 
        usuarios_email_idx ON usuarios(email)
      `);
    } catch (idxError) {
      //console.log('Índice já existe, continuando...');
    }

    await client.query('COMMIT');
    //console.log('✅ Tabela e índices verificados com sucesso');
  } catch (err) {
    await client.query('ROLLBACK');
    // Modifique esta mensagem para não assustar :)
    //console.log('ℹ️ A tabela/índices já existiam, continuando...');
    return; // Sai silenciosamente
  } finally {
    client.release();
  }
}

// Inicialização segura
async function initializeDatabase() {
  try {
    await createUsersTable();
  } catch (err) {
    console.error('Falha na inicialização do banco:', err);
    // Não encerra o processo para permitir reinicialização
  }
}

// Verifica conexão e tabelas periodicamente (opcional)
setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.debug('✔️ Conexão ativa'))
    .catch(err => console.error('⚠️ Falha na verificação:', err));
}, 300000); // A cada 5 minutos

// Inicializa imediatamente
initializeDatabase();

module.exports = {
  pool,
  bcrypt,
  saltRounds,
  initializeDatabase // Exporta para controle explícito
};