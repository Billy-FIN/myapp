const express = require('express');
const router = express.Router();
const NotesItem = require('../object_class/NotesItem');

router.get('/notebook', async function (req, res, next) {
  items = []
  const q = req.query.q
  if (q == "null") {
    items = await NotesItem.find({}).sort({ date: -1 })
    req.session.searchBy = ""
    res.render('notebook', { items, searchBy: '' });
  } else {
    let sortBy
    if (req.query.searchBy != undefined) {
      req.session.searchBy = req.query.searchBy
    }
    if (req.query.sortBy != undefined) {
      sortBy = req.query.sortBy || undefined
    }
    let searchBy = req.session.searchBy

    items =
      await NotesItem.aggregate(
        [
          {
            $match: {
                     $or: [{ title: { $regex: searchBy } },
                           { category: { $regex: searchBy } },
                           { tag: { $regex: searchBy } },
                           { details: { $regex: searchBy } },
                           { username: { $regex: searchBy } }],
                    }
          },
          {
            $match: { category: { $regex: req.query.category ? req.query.category : '' },
                      tag: { $regex: req.query.tag ? req.query.tag : '' },
                      username: { $regex: req.query.username? req.query.username : '' }
                    }
          },
          {
            $sort: { [sortBy]: 1 }
          }
        ]
      )
    res.render('notebook', { items, searchBy });
  }
});

router.post('/notebook',
  async (req, res, next) => {
    if (!res.locals.loggedIn) {
      req.user = { username: 'anonymous' }
    }
    const note = new NotesItem(
      {
        title: req.body.title,
        category: req.body.category,
        tag: req.body.tag,
        details: req.body.details,
        username: req.user.username,
        date: new Date(),
      })
    await note.save();
    res.redirect('/notebook')
  }
)

router.get('/notebook/show/:itemId',
  async (req, res, next) => {
    let result = await NotesItem.find({ _id: req.params.itemId })
    let details = result[0].details
    res.send(result)
  }
)

module.exports = router;