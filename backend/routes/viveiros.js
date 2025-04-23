const express = require('express');
const router = express.Router();
const viveirosController = require('../controllers/viveirosController');

router.get('/', viveirosController.listar);
router.post('/', viveirosController.criar);
router.get('/:id', viveirosController.mostrar);
router.put('/:id', viveirosController.atualizar);
router.delete('/:id', viveirosController.deletar);

module.exports = router;