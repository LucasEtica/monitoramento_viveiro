// controllers/tiposFertilizanteController.js
const { pool } = require('../models/tipoFertilizanteModel');

const tiposFertilizanteController = {
  async listar(req, res) {
    try {
      const result = await pool.query('SELECT * FROM tipo_fertilizante ORDER BY id ASC');
      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error('Erro ao listar tipos de fertilizante:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar tipos de fertilizante' });
    }
  },

  async criar(req, res) {
    const { titulo, descricao } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO tipo_fertilizante (titulo, descricao) VALUES ($1, $2) RETURNING *',
        [titulo, descricao]
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
    const { titulo, descricao } = req.body;
    try {
      const result = await pool.query(
        'UPDATE tipo_fertilizante SET titulo = $1, descricao = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [titulo, descricao, id]
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
