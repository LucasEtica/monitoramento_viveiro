const { pool } = require('../models/tipoPlantaModel');

const tipoPlantaController = {
  async listar(req, res) {
    try {
      const result = await pool.query('SELECT * FROM tipos_planta ORDER BY id');
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
      const { titulo, descricao } = req.body;
      const result = await pool.query(
        'INSERT INTO tipos_planta (titulo, descricao) VALUES ($1, $2) RETURNING *',
        [titulo, descricao]
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
      const { titulo, descricao } = req.body;
      const result = await pool.query(
        'UPDATE tipos_planta SET titulo = $1, descricao = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [titulo, descricao, id]
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
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM tipos_planta WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Tipo de planta não encontrado' });
      }

      res.json({ success: true, message: 'Tipo de planta deletado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erro ao deletar tipo de planta' });
    }
  },

    // DELETE /api/tipos-planta/:id
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
    },
};

module.exports = tipoPlantaController;
