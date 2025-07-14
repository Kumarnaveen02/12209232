const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getAnalytics
} = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getAnalytics);

module.exports = router;
