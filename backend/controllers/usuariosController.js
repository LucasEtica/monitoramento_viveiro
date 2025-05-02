const { pool, bcrypt, saltRounds } = require('../models/usuarioModel');

const usuariosController = {
  // Listar todos os usuários
  async listar(req, res) {
    try {
      const result = await pool.query('SELECT id, nome, email, created_at FROM usuarios');
      res.json(result.rows);
    } catch (err) {
      console.error('Erro ao listar usuários', err);
      res.status(500).send('Erro ao listar usuários');
    }
  },

  async logar(req, res) {
    console.log("Chegou, deu bom!")
    console.log("Dados recebidos:", req.body);
    const { email, senha } = req.body;
  
    try {
      // Busca o usuário pelo email
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      const usuario = result.rows[0];
  
      if (!usuario) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }
  
      // Compara senha com bcrypt
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }
  
      return res.json({
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
        },
        token: 'fake-token', // futuramente substitua por JWT real
      });
    } catch (err) {
      console.error('Erro no login:', err);
      res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
  },

  // Obter usuário específico
  async mostrar(req, res) {
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
  },

  // Criar usuário
  async criar(req, res) {
    const { nome, email, senha } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(senha, saltRounds);
      const result = await pool.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at',
        [nome, email, hashedPassword]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao criar usuário', err);
      if (err.code === '23505') {
        res.status(400).send('Email já cadastrado');
      } else {
        res.status(500).send('Erro ao criar usuário');
      }
    }
  },

  // Atualizar usuário
  async atualizar(req, res) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    try {
      let query, params;
      
      if (senha) {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING id, nome, email, created_at';
        params = [nome, email, hashedPassword, id];
      } else {
        query = 'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email, created_at';
        params = [nome, email, id];
      }
      
      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        return res.status(404).send('Usuário não encontrado');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao atualizar usuário', err);
      res.status(500).send('Erro ao atualizar usuário');
    }
  },

  // Deletar usuário
  async deletar(req, res) {
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
  }
};

module.exports = usuariosController;