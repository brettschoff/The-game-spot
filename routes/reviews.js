const express = require('express')
const router = express.Router()
const reviewCtrl = require('../controllers/reviews')

router.get('/reviews/:id/edit', reviewCtrl.edit)

router.post('/games/:id/reviews', reviewCtrl.create)

router.put('/reviews/:id', reviewCtrl.update)

router.delete('/reviews/:id', reviewCtrl.delete)


module.exports = router