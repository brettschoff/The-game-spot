const Game = require('../models/game')

module.exports = {
    create,
    delete: deleteReview,
    update,
    edit
}

const findOne = async () => {
    
}





async function create(req,res) {
    try{
        const oneGame = await Game.findById(req.params.id);
        req.body.userName = req.user.name;
        req.body.userId = req.user._id;
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
        const oneGame = await Game.findOne({'review._id': req.params.id, 'review.userId': req.user._id})
        if(!oneGame) return res.redirect('/games')
        oneGame.review.remove(req.params.id)
        await oneGame.save()
        res.redirect(`/games/${oneGame._id}`)
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}

async function update(req, res) {
    try{
        const gameDoc = await Game.findOneAndUpdate({'review._id': req.params.id, 'review._id': req.params.id}, { $set: { "review.$.text" : req.body.text, "review.$.rating": req.body.rating, "review.$.date": Date.now(), "review.$.edited": true}})

        res.redirect(`/games/${gameDoc._id}`)
    } catch(err){
        console.log(err)
        res.send(err)
    }
}

async function edit(req, res) {
    try{
    const oneGame = await Game.findOne({'review._id': req.params.id, 'review.userId': req.user._id})
    if(!oneGame) return res.redirect('/games')
    res.render('reviews/edit',{
        game: oneGame,
        review: oneGame.review.id(req.params.id)
    })
    } catch(err){
        console.log(err)
        res.send(err)
    }
}