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

async function tableExists(tableName) {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)",
    [tableName]
  );
  return result.rows[0].exists;
}

// Validação crítica da senha
if (!dbConfig.password) {
  console.error('❌ Erro: DB_PASSWORD não definida no .env');
  process.exit(1);
}

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
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

async function buscarPorEmail(email) {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0]; // Retorna o primeiro usuário encontrado, ou undefined
}

// Versão robusta da criação de tabela
async function createUsersTable() {
  const client = await pool.connect().catch(err => {
    console.error('Erro ao obter cliente da pool:', err);
    throw err;
  });

  try {
    await client.query('BEGIN');

    if (!(await tableExists('usuarios'))) {
      await client.query(`
        CREATE TABLE usuarios (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          senha VARCHAR(100) NOT NULL,
          admin BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    await client.query('COMMIT');
    
    try {
      await client.query(`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS 
        usuarios_email_idx ON usuarios(email)
      `);
    } catch (idxError) {
      //console.log('Índice já existe, continuando...');
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Falha ao criar tabela de usuários:', err);
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
  initializeDatabase,
  buscarPorEmail // 👈 Adicionado aqui
};