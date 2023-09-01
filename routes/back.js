var express = require('express');
var router = express.Router();

router.get('/back_management', function(req, res, next) {
  res.render('back_management');
});

module.exports = router;