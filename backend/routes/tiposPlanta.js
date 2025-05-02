const express = require('express');
const router = express.Router();
const tiposPlantaController = require('../controllers/tiposPlantaController');

router.get('/', tiposPlantaController.listar);
router.get('/:id', tiposPlantaController.mostrar);
router.post('/', tiposPlantaController.criar);
router.put('/:id', tiposPlantaController.atualizar);
router.delete('/:id', tiposPlantaController.deletar);
router.delete('/:id', tiposPlantaController.deletar);

module.exports = router;
