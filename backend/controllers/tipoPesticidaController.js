const { pool } = require('../models/tipoPesticidaModel');

// Listar todos os tipos de pesticida
async function listarTiposPesticida(req, res) {
  try {
    const { viveiro_id } = req.query;

    let result;
    if (viveiro_id) {
      result = await pool.query(
        `SELECT tp.*, v.titulo AS viveiro_nome
         FROM tipos_pesticida tp
         JOIN viveiros v ON tp.viveiro_id = v.id
         WHERE tp.viveiro_id = $1
         ORDER BY tp.id ASC`,
        [viveiro_id]
      );
    } else {
      result = await pool.query(
        `SELECT tp.*, v.titulo AS viveiro_nome
         FROM tipos_pesticida tp
         JOIN viveiros v ON tp.viveiro_id = v.id
         ORDER BY tp.id ASC`
      );
    }

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ Erro ao listar tipos de pesticida:', error);
    res.status(500).json({ success: false, error: 'Erro ao listar tipos de pesticida.' });
  }
}

// Criar um novo tipo de pesticida
async function criarTipoPesticida(req, res) {
  const { titulo, descricao, viveiro_id } = req.body;

  if (!titulo || !viveiro_id) {
    return res.status(400).json({ success: false, error: 'Título e viveiro_id são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tipos_pesticida (titulo, descricao, viveiro_id) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descricao, viveiro_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao criar tipo de pesticida:', error);
    res.status(500).json({ success: false, error: 'Erro ao criar tipo de pesticida.' });
  }
}

// Atualizar um tipo de pesticida
async function atualizarTipoPesticida(req, res) {
  const { id } = req.params;
  const { titulo, descricao, inativo, viveiro_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tipos_pesticida 
       SET titulo = $1, descricao = $2, inativo = $3, viveiro_id = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 RETURNING *`,
      [titulo, descricao, inativo, viveiro_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Tipo de pesticida não encontrado.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao atualizar tipo de pesticida:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar tipo de pesticida.' });
  }
}

// Mostrar um tipo de pesticida por ID
async function mostrarTipoPesticida(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT tp.*, v.titulo AS viveiro_nome
       FROM tipos_pesticida tp
       JOIN viveiros v ON tp.viveiro_id = v.id
       WHERE tp.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tipo de pesticida não encontrado.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao buscar tipo de pesticida:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar tipo de pesticida.' });
  }
}

// Deletar um tipo de pesticida
async function deletarTipoPesticida(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tipos_pesticida WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Tipo de pesticida não encontrado.' });
    }

    res.json({ success: true, message: 'Tipo de pesticida deletado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao deletar tipo de pesticida:', error);
    res.status(500).json({ success: false, error: 'Erro ao deletar tipo de pesticida.' });
  }
}

module.exports = {
  listarTiposPesticida,
  criarTipoPesticida,
  atualizarTipoPesticida,
  deletarTipoPesticida,
  mostrarTipoPesticida
};
