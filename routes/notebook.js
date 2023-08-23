const express = require('express');
const router = express.Router();
const NotesItem = require('../object_class/NotesItem');

router.get('/notebook', async function (req, res, next) {
  const sortBy = req.query.sortBy
  const searchBy = req.query.searchBy
  const selectBy = req.query.selectBy
  let items = []
  if (typeof (sortBy) == 'string') {
    switch (sortBy) {
      case 'category':
        items = await NotesItem.find({}).sort({ category: 1 })
        break;
      case 'tag':
        items = await NotesItem.find({}).sort({ tag: 1 })
        break;
      case 'date':
        items = await NotesItem.find({}).sort({ date: -1 })
        break;
      case 'username':
        items = await NotesItem.find({}).sort({ username: 1 })
        break;
      default:
        break;
    }
  } else if (typeof (searchBy) == 'string') {
    items = await NotesItem.find({ $or: [{ title: { $regex: searchBy } }, { category: { $regex: searchBy } }, { tag: { $regex: searchBy } }, { details: { $regex: searchBy } }, { username: { $regex: searchBy } }] })
  } else if (typeof (selectBy) == 'string') {
    let conditions = selectBy.split('&')
    // items = await NotesItem.find({ $and: [{ category: { $regex: conditions[0] } }, { tag: { $regex: conditions[1] } }, { username: { $regex: conditions[2] } }] })
  } else {
    items = await NotesItem.find({}).sort({ date: -1 })
  }
  res.render('notebook', { items });
});

// router.get('/notebook',
//     isLoggedIn,
//     // (req, res, next) => {
//     //     res.render('notebook');
//     // }
//     async (req, res, next) => {
//         const sortBy = req.query.sortBy
//         let items = []
//         if (sortBy == 'amount') {
//             items =
//                 await TransactionItem.find({ userId: req.user._id }).sort({ amount: -1 })
//         } else if (sortBy == 'category') {
//             items =
//                 await TransactionItem.find({ userId: req.user._id }).sort({ category: 1 })
//         } else if (sortBy == "description") {
//             items =
//                 await TransactionItem.find({ userId: req.user._id }).sort({ description: 1 })
//         } else if (sortBy == "date") {
//             items =
//                 await TransactionItem.find({ userId: req.user._id }).sort({ date: -1 })
//         } else {
//             items =
//                 await TransactionItem.find({ userId: req.user._id })
//         }

//         res.render('transactionList', { items });
//     }
// )

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