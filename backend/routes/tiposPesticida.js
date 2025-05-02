const express = require('express');
const router = express.Router();
const tipoPesticidaController = require('../controllers/tipoPesticidaController');

router.get('/', tipoPesticidaController.listarTiposPesticida);
router.get('/:id', tipoPesticidaController.mostrarTipoPesticida);
router.post('/', tipoPesticidaController.criarTipoPesticida);
router.put('/:id', tipoPesticidaController.atualizarTipoPesticida);
router.delete('/:id', tipoPesticidaController.deletarTipoPesticida);

module.exports = router;
