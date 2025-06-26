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

pool.on('connect', () => console.log('🟢 Conexão PostgreSQL (eventos)'));
pool.on('error', (err) => console.error('❌ Erro PostgreSQL (eventos):', err));

async function createEventosTable() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existsResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'eventos'
      )
    `);

    if (!existsResult.rows[0].exists) {
      await client.query(`
        CREATE TABLE eventos (
          id SERIAL PRIMARY KEY,
          viveiro_id INTEGER NOT NULL,
          tipo_fertilizante_id INTEGER,
          tipo_pesticida_id INTEGER,
          irrigacao BOOLEAN DEFAULT false,
          data_evento TIMESTAMP NOT NULL,
          lido BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_evento_viveiro FOREIGN KEY (viveiro_id) REFERENCES viveiros(id),
          CONSTRAINT fk_evento_fertilizante FOREIGN KEY (tipo_fertilizante_id) REFERENCES tipo_fertilizante(id),
          CONSTRAINT fk_evento_pesticida FOREIGN KEY (tipo_pesticida_id) REFERENCES tipos_pesticida(id)
        )
      `);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar tabela eventos:', err);
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  try {
    await createEventosTable();
  } catch (err) {
    console.error('❌ Falha na inicialização da tabela eventos:', err);
  }
}

setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.debug('✔️ Conexão ativa (eventos)'))
    .catch(err => console.error('⚠️ Falha na verificação (eventos):', err));
}, 300000);

module.exports = {
  pool,
  initializeDatabase
};
