var controllerFolder = '../app/controllers/';

// Dependencies
var router = require('express').Router();
var pages = require(controllerFolder + 'pages');

// Routes
router.get('/', pages.index);

module.exports = router;