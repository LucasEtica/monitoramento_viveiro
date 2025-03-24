// server.js

const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();
app.use(express.json());

// Criando a conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exemplo de endpoint que retorna todos os dados da tabela (substitua conforme necessário)
app.get('/api/plantas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plantas');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao acessar o banco de dados', err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

// Configuração do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

