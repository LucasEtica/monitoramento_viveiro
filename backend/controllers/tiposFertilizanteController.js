// controllers/tiposFertilizanteController.js
const { pool } = require('../models/tipoFertilizanteModel');

const tiposFertilizanteController = {
  async listar(req, res) {
    const { viveiro_id } = req.query;
    try {
      let result;
      if (viveiro_id) {
        result = await pool.query(`
          SELECT tf.*, v.titulo AS viveiro_nome
          FROM tipo_fertilizante tf
          JOIN viveiros v ON tf.viveiro_id = v.id
          WHERE tf.viveiro_id = $1
          ORDER BY tf.id ASC
        `, [viveiro_id]);
      } else {
        result = await pool.query(`
          SELECT tf.*, v.titulo AS viveiro_nome
          FROM tipo_fertilizante tf
          JOIN viveiros v ON tf.viveiro_id = v.id
          ORDER BY tf.id ASC
        `);
      }
      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error('Erro ao listar tipos de fertilizante:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar tipos de fertilizante' });
    }
  },

  async criar(req, res) {
    const { titulo, descricao, viveiro_id } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tipo_fertilizante (titulo, descricao, viveiro_id) VALUES ($1, $2, $3) RETURNING *`,
        [titulo, descricao, viveiro_id]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao criar tipo de fertilizante:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar tipo de fertilizante' });
    }
  },

  async mostrar(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM tipo_fertilizante WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Tipo de fertilizante não encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao buscar tipo de fertilizante:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar tipo de fertilizante' });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { titulo, descricao, viveiro_id, inativo } = req.body;
    try {
      const result = await pool.query(
        `UPDATE tipo_fertilizante SET titulo = $1, descricao = $2, viveiro_id = $3, inativo = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
        [titulo, descricao, viveiro_id, inativo, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Tipo de fertilizante não encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao atualizar tipo de fertilizante:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar tipo de fertilizante' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM tipo_fertilizante WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Tipo de fertilizante não encontrado' });
      }
      res.json({ success: true, message: 'Tipo de fertilizante deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar tipo de fertilizante:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar tipo de fertilizante' });
    }
  }
};

module.exports = tiposFertilizanteController;
