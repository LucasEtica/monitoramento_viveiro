const { pool } = require('../models/viveiroModel');

const viveirosController = {
  async listar(req, res) {
    try {
      const { admin, usuario_id } = req.query;

      let result;
      //console.log("Admin?" + admin)
      if (admin === 'true') {
        // Admin vê todos os viveiros
        result = await pool.query(`
          SELECT v.id, v.titulo, v.descricao, v.created_at, u.nome as usuario_nome
          FROM viveiros v
          JOIN usuarios u ON v.usuario_id = u.id
        `);
      } else if (usuario_id && !isNaN(parseInt(usuario_id))) {
        // Usuário comum vê apenas seus viveiros
        result = await pool.query(`
          SELECT v.id, v.titulo, v.descricao, v.created_at, u.nome as usuario_nome
          FROM viveiros v
          JOIN usuarios u ON v.usuario_id = u.id
          WHERE v.usuario_id = $1
        `, [parseInt(usuario_id)]);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Parâmetros inválidos ou ausentes'
        });
      }

      res.json({ success: true, data: result.rows });

    } catch (err) {
      console.error('❌ Erro ao listar viveiros:', err);
      res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async mostrar(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    try {
      const result = await pool.query(
        `SELECT 
          v.*, u.nome as usuario_nome, u.email as usuario_email
         FROM viveiros v
         JOIN usuarios u ON v.usuario_id = u.id
         WHERE v.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Viveiro não encontrado'
        });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao obter viveiro:', err);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter viveiro',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  async criar(req, res) {
    const { titulo, descricao, usuario_id } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Título é obrigatório'
      });
    }

    if (!usuario_id || !Number.isInteger(Number(usuario_id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuário inválido'
      });
    }

    try {
      const usuarioExists = await pool.query(
        'SELECT id FROM usuarios WHERE id = $1',
        [usuario_id]
      );

      if (usuarioExists.rowCount === 0) {
        return res.status(400).json({
          success: false,
          error: 'Usuário responsável não encontrado'
        });
      }

      const result = await pool.query(
        `INSERT INTO viveiros (titulo, descricao, usuario_id)
         VALUES ($1, $2, $3)
         RETURNING id, titulo, descricao, usuario_id, created_at`,
        [titulo.trim(), descricao?.trim(), usuario_id]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao criar viveiro:', err);

      let errorResponse = {
        success: false,
        error: 'Erro ao criar viveiro'
      };

      if (err.code === '23503') {
        errorResponse.error = 'Usuário responsável não encontrado';
        res.status(400).json(errorResponse);
      } else if (err.code === '23505') {
        errorResponse.error = 'Viveiro com este título já existe';
        res.status(400).json(errorResponse);
      } else {
        if (process.env.NODE_ENV === 'development') {
          errorResponse.details = err.message;
        }
        res.status(500).json(errorResponse);
      }
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { titulo, descricao, usuario_id } = req.body;

    try {
      const result = await pool.query(
        `UPDATE viveiros
         SET 
           titulo = COALESCE($1, titulo),
           descricao = COALESCE($2, descricao),
           usuario_id = COALESCE($3, usuario_id),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING id, titulo, descricao, usuario_id, created_at, updated_at`,
        [
          titulo?.trim(),
          descricao?.trim(),
          usuario_id,
          id
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Viveiro não encontrado'
        });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Erro ao atualizar viveiro:', err);
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar viveiro',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    try {
      const result = await pool.query(
        `DELETE FROM viveiros
         WHERE id = $1
         RETURNING id, titulo`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Viveiro não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Viveiro deletado com sucesso',
        deleted: result.rows[0]
      });
    } catch (err) {
      console.error('Erro ao deletar viveiro:', err);
      res.status(500).json({
        success: false,
        error: 'Erro ao deletar viveiro',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};

module.exports = viveirosController;
