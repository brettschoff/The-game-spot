const express = require('express')
const router = express.Router()
const gamesCtrl = require('../controllers/games')
const isLoggedIn = require('../config/auth')


router.get('/', gamesCtrl.index)
router.get('/new',isLoggedIn, gamesCtrl.new)
router.get('/:id/edit', isLoggedIn, gamesCtrl.edit)
router.get('/:id', gamesCtrl.show)

router.post('/', gamesCtrl.create)

router.put('/:id', gamesCtrl.update)

router.delete('/:id', isLoggedIn, gamesCtrl.delete)

module.exports = router;