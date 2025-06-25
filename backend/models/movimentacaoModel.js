const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'monitoramento_viveiro',
  password: 'postgres',
  port: 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

pool.on('connect', () => console.log('🟢 Conexão PostgreSQL (movimentações)'));
pool.on('error', (err) => console.error('❌ Erro PostgreSQL (movimentações):', err));

async function tableExists(tableName) {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)",
    [tableName]
  );
  return result.rows[0].exists;
}

async function createMovimentacoesTable() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (!(await tableExists('movimentacoes'))) {
      await client.query(`
        CREATE TABLE tipos_pesticida (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(100) NOT NULL,
          descricao TEXT,
          inativo BOOLEAN NOT NULL DEFAULT false,
          viveiro_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_tipos_pesticida_viveiro FOREIGN KEY (viveiro_id) REFERENCES viveiros(id)
        )
      `);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Falha na criação:', err);
    throw err;
  } finally {
    client.release();
  }
}

initializeDatabase();

async function initializeDatabase() {
  try {
    await createMovimentacoesTable();
  } catch (err) {
    console.error('❌ Falha na inicialização:', err);
    throw err;
  }
}

setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.debug('✔️ Conexão ativa (movimentações)'))
    .catch(err => console.error('⚠️ Falha na verificação:', err));
}, 300000);

module.exports = {
  pool,
  initializeDatabase,
  tableExists
};
