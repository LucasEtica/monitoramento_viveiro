// routes/tiposFertilizante.js
const express = require('express');
const router = express.Router();
const tiposFertilizanteController = require('../controllers/tiposFertilizanteController');

router.get('/', tiposFertilizanteController.listar);
router.post('/', tiposFertilizanteController.criar);
router.get('/:id', tiposFertilizanteController.mostrar);
router.put('/:id', tiposFertilizanteController.atualizar);
router.delete('/:id', tiposFertilizanteController.deletar);

module.exports = router;