const { pool } = require('../models/tipoPesticidaModel');

// Listar todos os tipos de pesticida
async function listarTiposPesticida(req, res) {
  try {
    const result = await pool.query('SELECT * FROM tipos_pesticida ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao listar tipos de pesticida:', error);
    res.status(500).json({ error: 'Erro ao listar tipos de pesticida.' });
  }
}

// Criar um novo tipo de pesticida
async function criarTipoPesticida(req, res) {
  const { titulo, descricao } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'O campo título é obrigatório.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tipos_pesticida (titulo, descricao) VALUES ($1, $2) RETURNING *',
      [titulo, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao criar tipo de pesticida:', error);
    res.status(500).json({ error: 'Erro ao criar tipo de pesticida.' });
  }
}

// Atualizar um tipo de pesticida
async function atualizarTipoPesticida(req, res) {
  const { id } = req.params;
  const { titulo, descricao } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tipos_pesticida SET titulo = $1, descricao = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [titulo, descricao, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tipo de pesticida não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao atualizar tipo de pesticida:', error);
    res.status(500).json({ error: 'Erro ao atualizar tipo de pesticida.' });
  }
}

// Mostrar um tipo de pesticida por ID
async function mostrarTipoPesticida(req, res) {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM tipos_pesticida WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tipo de pesticida não encontrado.' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('❌ Erro ao buscar tipo de pesticida:', error);
      res.status(500).json({ error: 'Erro ao buscar tipo de pesticida.' });
    }
  }

// Deletar um tipo de pesticida
async function deletarTipoPesticida(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tipos_pesticida WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tipo de pesticida não encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('❌ Erro ao deletar tipo de pesticida:', error);
    res.status(500).json({ error: 'Erro ao deletar tipo de pesticida.' });
  }
}

module.exports = {
  listarTiposPesticida,
  criarTipoPesticida,
  atualizarTipoPesticida,
  deletarTipoPesticida,
  mostrarTipoPesticida
};
