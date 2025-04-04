// server.js

const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors'); // Adicione esta linha

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Habilita CORS para todas as rotas

// Conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CRUD de Usuários

// Criar tabela de usuários (executar apenas uma vez)
async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabela de usuários criada com sucesso');
  } catch (err) {
    console.error('Erro ao criar tabela de usuários', err);
  }
}

createUsersTable();

// Rotas para CRUD de usuários

// Criar usuário
app.post('/api/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário', err);
    res.status(500).send('Erro ao criar usuário');
  }
});

// Listar todos os usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome, email, created_at FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar usuários', err);
    res.status(500).send('Erro ao listar usuários');
  }
});

// Obter usuário específico
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, nome, email, created_at FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao obter usuário', err);
    res.status(500).send('Erro ao obter usuário');
  }
});

// Atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
      [nome, email, senha, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar usuário', err);
    res.status(500).send('Erro ao atualizar usuário');
  }
});

// Deletar usuário
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário', err);
    res.status(500).send('Erro ao deletar usuário');
  }
});

// Mantenha sua rota original de plantas
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