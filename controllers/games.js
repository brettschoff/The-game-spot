const Game = require('../models/game')


module.exports = {
    index,
    new: newGame,
    show,
    create
}

async function index(req, res) {
    try{
        const allGames = await Game.find({})
        res.render('games/index', {
            games: allGames
        })
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}

function newGame(req, res) {
    res.render('games/new')
}

async function show(req, res) {
    try{
        const oneGame = await Game.findById(req.params.id).populate('review').exec()
        const gameReviews = oneGame.review
        console.log(oneGame)
        res.render('games/show', {
            game: oneGame,
            review: gameReviews
        })
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}
async function create(req, res) {
    try{
        req.body.upcoming = !!req.body.upcoming
        const newGame = await Game.create(req.body)
        res.redirect(`/games/${newGame._id}`)
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}
