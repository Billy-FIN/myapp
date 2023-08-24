const express = require('express');
const router = express.Router();
const NotesItem = require('../object_class/NotesItem');

router.get('/notebook', async function (req, res, next) {
  let sortBy
  if(req.query.searchBy != undefined){
    req.session.searchBy = req.query.searchBy
  }
  if(req.query.sortBy != undefined){
    sortBy = req.query.sortBy
  }
  let searchBy = req.session.searchBy

  let items = await NotesItem.find({}).sort({ date: -1 })
  if (typeof (searchBy) == 'string') {
    items = await NotesItem.find({ $or: [{ title: { $regex: searchBy } }, { category: { $regex: searchBy } }, { tag: { $regex: searchBy } }, { details: { $regex: searchBy } }, { username: { $regex: searchBy } }] })
  }

  if(typeof (req.query.category) == 'string' || typeof (req.query.tag) == 'string' || typeof (req.query.username) == 'string'){
    items = await NotesItem.find({ $and: [{ category: { $regex: req.query.category } }, { tag: { $regex: req.query.tag } }, { username: { $regex: req.query.username } }] })
  }
  switch (sortBy) {
    case 'category':
      items = items.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'tag':
      items = items.sort((a, b) => a.tag.localeCompare(b.tag));
      break;
    case 'username':
      items = items.sort((a, b) => a.username.localeCompare(b.username));
      break;
    default:
      break;
  }
  res.render('notebook', { items });



  // if (typeof (sortBy) == 'string') {
  //   switch (sortBy) {
  //     case 'category':
  //       items = await NotesItem.find({}).sort({ category: 1 })
  //       break;
  //     case 'tag':
  //       items = await NotesItem.find({}).sort({ tag: 1 })
  //       break;
  //     case 'date':
  //       items = await NotesItem.find({}).sort({ date: -1 })
  //       break;
  //     case 'username':
  //       items = await NotesItem.find({}).sort({ username: 1 })
  //       break;
  //     default:
  //       break;
  //   }
  // } else if (typeof (searchBy) == 'string') {
  //   items = await NotesItem.find({ $or: [{ title: { $regex: searchBy } }, { category: { $regex: searchBy } }, { tag: { $regex: searchBy } }, { details: { $regex: searchBy } }, { username: { $regex: searchBy } }] })
  // } else if (typeof (selectBy) == 'string') {
  //   let conditions = selectBy.split('&')
  //   items = await NotesItem.find({ $and: [{ category: { $regex: conditions[0] } }, { tag: { $regex: conditions[1] } }, { username: { $regex: conditions[2] } }] })
  // } else {
  //   items = await NotesItem.find({}).sort({ date: -1 })
  // }
  // res.render('notebook', { items });
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