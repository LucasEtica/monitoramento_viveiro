const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.listar);
router.post('/', usuariosController.criar);
router.get('/:id', usuariosController.mostrar);
router.put('/:id', usuariosController.atualizar);
router.delete('/:id', usuariosController.deletar);

module.exports = router;