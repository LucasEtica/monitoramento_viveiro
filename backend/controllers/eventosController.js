const { pool } = require('../models/eventoModel');

const eventosController = {
  async listar(req, res) {
    const { viveiro_id } = req.query;
    try {
      let result;
      if (viveiro_id) {
        result = await pool.query(`
          SELECT e.*, 
                 v.titulo AS viveiro_nome,
                 tf.titulo AS fertilizante_nome,
                 tp.titulo AS pesticida_nome
          FROM eventos e
          JOIN viveiros v ON e.viveiro_id = v.id
          LEFT JOIN tipo_fertilizante tf ON e.tipo_fertilizante_id = tf.id
          LEFT JOIN tipos_pesticida tp ON e.tipo_pesticida_id = tp.id
          WHERE e.viveiro_id = $1
          ORDER BY e.data_evento ASC
        `, [viveiro_id]);
      } else {
        result = await pool.query(`
          SELECT e.*, 
                 v.titulo AS viveiro_nome,
                 tf.titulo AS fertilizante_nome,
                 tp.titulo AS pesticida_nome
          FROM eventos e
          JOIN viveiros v ON e.viveiro_id = v.id
          LEFT JOIN tipo_fertilizante tf ON e.tipo_fertilizante_id = tf.id
          LEFT JOIN tipos_pesticida tp ON e.tipo_pesticida_id = tp.id
          ORDER BY e.data_evento ASC
        `);
      }
      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error('Erro ao listar eventos:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar eventos' });
    }
  },

  async criar(req, res) {
    const { viveiro_id, tipo_fertilizante_id, tipo_pesticida_id, irrigacao, data_evento } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO eventos (viveiro_id, tipo_fertilizante_id, tipo_pesticida_id, irrigacao, data_evento) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [viveiro_id, tipo_fertilizante_id || null, tipo_pesticida_id || null, irrigacao || false, data_evento]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar evento' });
    }
  },

  async mostrar(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query(`SELECT * FROM eventos WHERE id = $1`, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Evento não encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao buscar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar evento' });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const campos = [];
    const valores = [];
    let idx = 1;

    for (const campo of ['viveiro_id', 'tipo_fertilizante_id', 'tipo_pesticida_id', 'irrigacao', 'data_evento', 'lido']) {
      if (req.body[campo] !== undefined) {
        campos.push(`${campo} = $${idx++}`);
        valores.push(req.body[campo]);
      }
    }

    if (campos.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum campo para atualizar' });
    }

    const query = `
      UPDATE eventos SET ${campos.join(', ')}
      WHERE id = $${idx} RETURNING *;
    `;
    valores.push(id);

    try {
      const result = await pool.query(query, valores);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Evento não encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar evento' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM eventos WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Evento não encontrado' });
      }
      res.json({ success: true, message: 'Evento deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar evento' });
    }
  }
};

module.exports = eventosController;
