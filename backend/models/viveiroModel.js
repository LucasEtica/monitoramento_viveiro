const { Pool } = require('pg');

// Configuração (mantida igual)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'monitoramento_viveiro',
  password: 'postgres',
  port: 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Handlers (mantidos)
pool.on('connect', () => console.log('🟢 Conexão PostgreSQL (viveiros)'));
pool.on('error', (err) => console.error('❌ Erro PostgreSQL (viveiros):', err));

// Função compartilhada para verificar tabelas
async function tableExists(tableName) {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)",
    [tableName]
  );
  return result.rows[0].exists;
}

// Criação da tabela com tratamento melhorado
async function createViveirosTable() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (!(await tableExists('usuarios'))) {
      throw new Error('Tabela usuarios não existe. Crie usuários primeiro.');
    }

    if (!(await tableExists('viveiros'))) {
      //console.log('🛠️ Criando tabela viveiros...');
      await client.query(`
        CREATE TABLE viveiros (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(100) NOT NULL,
          descricao TEXT,
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.message.includes('already exists')) {
      //console.log('ℹ️ Tabela viveiros já existia');
      return;
    }
    console.error('❌ Falha na criação:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Inicialização simplificada
async function initializeDatabase() {
  try {
    await createViveirosTable();
    //console.log('✅ Tabela viveiros pronta');
  } catch (err) {
    console.error('❌ Falha na inicialização:', err);
    throw err;
  }
}

// Verificação periódica (opcional)
setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.debug('✔️ Conexão ativa (viveiros)'))
    .catch(err => console.error('⚠️ Falha na verificação:', err));
}, 300000);

module.exports = {
  pool,
  initializeDatabase,
  tableExists
};