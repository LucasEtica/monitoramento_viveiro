const { pool } = require('../models/movimentacaoModel');

const movimentacoesController = {
  async listar(req, res) {
    try {
      const { viveiro_id } = req.query;
      let result;

      if (viveiro_id) {
        result = await pool.query(`
          SELECT 
            m.*, 
            v.titulo AS viveiro_nome,
            tp.titulo AS planta_nome,
            tf.titulo AS fertilizante_nome,
            tps.titulo AS pesticida_nome
          FROM movimentacoes m
          JOIN viveiros v ON m.viveiro_id = v.id
          LEFT JOIN tipos_planta tp ON m.tipo_planta_id = tp.id
          LEFT JOIN tipo_fertilizante tf ON m.tipo_fertilizante_id = tf.id
          LEFT JOIN tipos_pesticida tps ON m.tipo_pesticida_id = tps.id
          WHERE m.viveiro_id = $1
        `, [viveiro_id]);
      } else {
        result = await pool.query(`
          SELECT 
            m.*, 
            v.titulo AS viveiro_nome,
            tp.titulo AS planta_nome,
            tf.titulo AS fertilizante_nome,
            tps.titulo AS pesticida_nome
          FROM movimentacoes m
          JOIN viveiros v ON m.viveiro_id = v.id
          LEFT JOIN tipos_planta tp ON m.tipo_planta_id = tp.id
          LEFT JOIN tipo_fertilizante tf ON m.tipo_fertilizante_id = tf.id
          LEFT JOIN tipos_pesticida tps ON m.tipo_pesticida_id = tps.id
        `);
      }

      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error('❌ Erro ao listar movimentações:', err);
      res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM movimentacoes WHERE id = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Movimentação não encontrada' });
      }

      res.status(200).json({ success: true, message: 'Movimentação excluída' });
    } catch (err) {
      console.error('❌ Erro ao deletar movimentação:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar movimentação' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;

    // Simulação: verificação de admin (substitua pelo seu middleware real se tiver)
    const isAdmin = req.headers['x-admin'] === 'true'; // ⚠️ Você pode ajustar isso com base na sua autenticação real

    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Apenas administradores podem excluir movimentações.' });
    }

    try {
      const result = await pool.query('DELETE FROM movimentacoes WHERE id = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Movimentação não encontrada' });
      }

      res.status(200).json({ success: true, message: 'Movimentação excluída' });
    } catch (err) {
      console.error('❌ Erro ao deletar movimentação:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar movimentação' });
    }
  },

  async criar(req, res) {
    const {
      observacao,
      tipo_movimentacao,
      viveiro_id,
      tipo_planta_id,
      tipo_fertilizante_id,
      tipo_pesticida_id,
      valor,
      quantidade
    } = req.body;

    if (!['credito', 'debito'].includes(tipo_movimentacao)) {
      return res.status(400).json({ success: false, error: 'Tipo de movimentação inválido' });
    }

    if (!viveiro_id || !valor) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes' });
    }

    const plantaId = tipo_planta_id ? parseInt(tipo_planta_id) : null;
    const fertilizanteId = tipo_fertilizante_id ? parseInt(tipo_fertilizante_id) : null;
    const pesticidaId = tipo_pesticida_id ? parseInt(tipo_pesticida_id) : null;

    try {
      const result = await pool.query(`
        INSERT INTO movimentacoes (
          observacao, tipo_movimentacao, viveiro_id,
          tipo_planta_id, tipo_fertilizante_id, tipo_pesticida_id,
          valor, quantidade
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        observacao || null,
        tipo_movimentacao,
        parseInt(viveiro_id),
        plantaId,
        fertilizanteId,
        pesticidaId,
        parseFloat(valor),
        parseInt(quantidade || 1)
      ]);

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('❌ Erro ao criar movimentação:', err.message);
      console.error('📄 Detalhes do erro:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar movimentação' });
    }
  }
};

module.exports = movimentacoesController;
