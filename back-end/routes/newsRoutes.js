const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/NewsController');

router.get('/', NewsController.getAllNews);
router.get('/:id', NewsController.getNewsById);
router.post('/', NewsController.addNews);
router.put('/:id', NewsController.updateNews);
router.delete('/:id', NewsController.deleteNews);

module.exports = router;