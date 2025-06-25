const { pool } = require('../models/tipoPlantaModel');

const tipoPlantaController = {
  async listar(req, res) {
    try {
      const result = await pool.query(`
        SELECT tp.*, v.titulo AS viveiro_nome
        FROM tipos_planta tp
        JOIN viveiros v ON tp.viveiro_id = v.id
        ORDER BY tp.id
      `);
      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erro ao listar tipos de planta' });
    }
  },

  async mostrar(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM tipos_planta WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Tipo de planta não encontrado' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erro ao buscar tipo de planta' });
    }
  },

  async criar(req, res) {
    try {
     const { titulo, descricao, viveiro_id, inativo = false } = req.body;
      const viveiroIdParsed = parseInt(viveiro_id);

      if (!titulo || isNaN(viveiroIdParsed)) {
        return res.status(400).json({ success: false, error: 'Título e viveiro_id válidos são obrigatórios' });
      }

      const result = await pool.query(
        `INSERT INTO tipos_planta
          (titulo, descricao, viveiro_id, inativo)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [titulo, descricao, viveiroIdParsed, inativo]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erro ao criar tipo de planta' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, inativo, viveiro_id } = req.body;
      const viveiroIdParsed = parseInt(viveiro_id);

      if (!titulo || isNaN(viveiroIdParsed)) {
        return res.status(400).json({ success: false, error: 'Título e viveiro_id válidos são obrigatórios' });
      }

      const result = await pool.query(
        `UPDATE tipos_planta 
         SET titulo = $1, descricao = $2, inativo = $3, viveiro_id = $4, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $5 
         RETURNING *`,
        [titulo, descricao, inativo, viveiroIdParsed, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Tipo de planta não encontrado' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar tipo de planta' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM tipos_planta WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Tipo de planta não encontrado' });
      }
      res.status(200).json({ success: true, message: 'Tipo de planta deletado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar tipo de planta' });
    }
  }
};

module.exports = tipoPlantaController;
