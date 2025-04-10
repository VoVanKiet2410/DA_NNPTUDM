const express = require('express');
const router = express.Router();
const BloodInventoryController = require('../controllers/BloodInventoryController');

router.get('/', BloodInventoryController.getAllBloodInventories);
router.post('/', BloodInventoryController.addBloodInventory);
router.put('/:id', BloodInventoryController.updateBloodInventory);
router.delete('/:id', BloodInventoryController.deleteBloodInventory);

module.exports = router;