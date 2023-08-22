const express = require('express');
const router = express.Router();
const NotesItem = require('../object_class/NotesItem');

router.get('/notebook', async function (req, res, next) {
  item = []
  items = await NotesItem.find({}).sort({ date: -1 })
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
        let result = await NotesItem.find({_id: req.params.itemId})
        let details = result[0].details
        res.send(result)
    }
)

module.exports = router;