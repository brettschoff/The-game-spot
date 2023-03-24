const Game = require('../models/game')

module.exports = {
    create,
    delete: deleteReview
}

async function create(req,res) {
    try{
        const oneGame = await Game.findById(req.params.id);
        req.body.userName = req.user.name;
        req.body.userId = req.user._id;
        req.body.userAvatar = req.user.avatar;
        req.body.date = Date.now()
        oneGame.review.push(req.body)
        await oneGame.save()
        res.redirect(`/games/${req.params.id}`)
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}
async function deleteReview(req, res) {
    try{
        const oneGame = await Game.findOne({'review._id' : req.params.id, 'review.userId': req.user._id})
        if(!oneGame) return res.redirect('/games')
        oneGame.review.remove(req.params.id)
        await oneGame.save()
        res.redirect(`/games/${oneGame._id}`)
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}