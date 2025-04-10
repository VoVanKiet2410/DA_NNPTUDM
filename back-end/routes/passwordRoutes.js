const express = require('express');
const router = express.Router();
const PasswordController = require('../controllers/PasswordController');

router.post('/reset-request', PasswordController.resetPasswordRequest);
router.post('/reset', PasswordController.resetPassword);

module.exports = router;