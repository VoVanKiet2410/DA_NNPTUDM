const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/FaqController');

router.get('/', FaqController.getAllFaqs);
router.post('/', FaqController.addFaq);
router.put('/:id', FaqController.updateFaq);
router.delete('/:id', FaqController.deleteFaq);

module.exports = router;