const express = require('express');
const router = express.Router();
const HealthCheckController = require('../controllers/HealthCheckController');

router.get('/', HealthCheckController.getAllHealthChecks);
router.post('/', HealthCheckController.addHealthCheck);

module.exports = router;