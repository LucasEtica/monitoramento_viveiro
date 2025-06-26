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

pool.on('connect', () => console.log('🟢 Conexão PostgreSQL (tipo_fertilizante)'));
pool.on('error', (err) => console.error('❌ Erro PostgreSQL (tipo_fertilizante):', err));

async function tableExists(tableName) {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)",
    [tableName]
  );
  return result.rows[0].exists;
}

async function createTipoFertilizanteTable() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      const existsResult = await client.query(
        "SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'tipo_fertilizante')"
      );
      if (!existsResult.rows[0].exists) {
        await client.query(`
        CREATE TABLE tipo_fertilizante (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(100) NOT NULL,
          descricao TEXT,
          inativo BOOLEAN NOT NULL DEFAULT false,
          viveiro_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_tipo_fertilizante_viveiro FOREIGN KEY (viveiro_id) REFERENCES viveiros(id)
        )
      `);
      }
  
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('❌ Erro ao criar tabela tipo_fertilizante:', err);
    } finally {
      client.release();
    }
  }
  
  async function initializeDatabase() {
    await createTipoFertilizanteTable();
  }

async function initializeDatabase() {
  try {
    await createTipoFertilizanteTable();
  } catch (err) {
    console.error('❌ Falha na inicialização do tipo_fertilizante:', err);
  }
}

setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.debug('✔️ Conexão ativa (tipo_fertilizante)'))
    .catch(err => console.error('⚠️ Falha na verificação (tipo_fertilizante):', err));
}, 300000);

module.exports = {
  pool,
  initializeDatabase,
  tableExists
};
