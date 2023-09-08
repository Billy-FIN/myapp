var express = require('express');
var router = express.Router();

router.get('/blog', function(req, res, next) {
    res.render('blog', { item: '' });
  });

module.exports = router;