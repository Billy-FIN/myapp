var express = require('express');
var router = express.Router();
const BlogItems = require('../object_class/BlogItems');

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/back_management',
  isLoggedIn,
  async function (req, res, next) {
    const interface = req.query.interface;
    let items = [];
    let status;
    if (interface == 'blogs') {
      status = 0;
    } else if (interface == 'drafts') {
      status = 1;
    } else if (interface == 'trash') {
      status = 2;
    } else {
      status = -1;
    }
    if (status == -1) {
      let code = -1;
      res.render('back_management', { status });
    } else {
      items =
        await BlogItems.aggregate(
          [
            {
              $match: {
                username: req.user.username,
                status: status
              }
            },
            {
              $sort: { date: -1 }
            }
          ]
        )
        res.render('back_management', { items, status });
    }
  });



module.exports = router;