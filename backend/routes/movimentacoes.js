const express = require('express');
const router = express.Router();
const movimentacoesController = require('../controllers/movimentacoesController');

router.get('/', movimentacoesController.listar);
router.post('/', movimentacoesController.criar);

module.exports = router;
