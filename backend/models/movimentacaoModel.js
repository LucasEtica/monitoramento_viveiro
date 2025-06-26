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
        CREATE TABLE movimentacoes (
          id SERIAL PRIMARY KEY,
          observacao TEXT,
          tipo_movimentacao VARCHAR(20) NOT NULL,
          valor NUMERIC(10, 2),
          quantidade INTEGER,
          viveiro_id INTEGER NOT NULL,
          tipo_planta_id INTEGER,
          tipo_fertilizante_id INTEGER,
          tipo_pesticida_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_movimentacao_viveiro FOREIGN KEY (viveiro_id) REFERENCES viveiros(id),
          CONSTRAINT fk_movimentacao_planta FOREIGN KEY (tipo_planta_id) REFERENCES tipos_planta(id),
          CONSTRAINT fk_movimentacao_fertilizante FOREIGN KEY (tipo_fertilizante_id) REFERENCES tipo_fertilizante(id),
          CONSTRAINT fk_movimentacao_pesticida FOREIGN KEY (tipo_pesticida_id) REFERENCES tipos_pesticida(id)
        )
      `);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Falha na criação da tabela movimentacoes:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  try {
    await createMovimentacoesTable();
  } catch (err) {
    console.error('❌ Falha na inicialização da tabela movimentacoes:', err);
    throw err;
  }
}

setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.debug('✔️ Conexão ativa (movimentações)'))
    .catch(err => console.error('⚠️ Falha na verificação (movimentações):', err));
}, 300000);

module.exports = {
  pool,
  initializeDatabase,
  tableExists
};
