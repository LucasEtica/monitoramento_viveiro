const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');

router.get('/', eventosController.listar);
router.post('/', eventosController.criar);
router.get('/:id', eventosController.mostrar);
router.put('/:id', eventosController.atualizar);
router.delete('/:id', eventosController.deletar);

module.exports = router;
