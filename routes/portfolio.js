const express = require('express');
const portFolioCtrl = require('../controllers/portFolioController');

const router = express.Router();

router.post('/contact', portFolioCtrl.senContact);

module.exports = router;