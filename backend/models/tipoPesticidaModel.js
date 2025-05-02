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

pool.on('connect', () => console.log('🟢 Conexão PostgreSQL (tipos_pesticida)'));
pool.on('error', (err) => console.error('❌ Erro PostgreSQL (tipos_pesticida):', err));

async function tableExists(tableName) {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)",
    [tableName]
  );
  return result.rows[0].exists;
}

async function createTipoPesticidaTable() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (!(await tableExists('tipos_pesticida'))) {
      await client.query(`
        CREATE TABLE tipos_pesticida (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(100) NOT NULL,
          descricao TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar tabela tipos_pesticida:', err);
  } finally {
    client.release();
  }
}

initializeDatabase();

async function initializeDatabase() {
  await createTipoPesticidaTable();
}

module.exports = {
  pool,
  initializeDatabase,
};
