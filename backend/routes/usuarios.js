const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const usuarios = require('../models/usuarioModel');
const { buscarPorEmail } = require('../models/usuarioModel'); // 👈 Corrigido aqui
const { pool, bcrypt } = require('../models/usuarioModel');

router.post('/login', usuariosController.logar);

router.get('/', usuariosController.listar);
router.post('/', usuariosController.criar);
router.get('/:id', usuariosController.mostrar);
router.put('/:id', usuariosController.atualizar);
router.delete('/:id', usuariosController.deletar);

module.exports = router;
