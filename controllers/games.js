const Game = require('../models/game')
const axios = require('axios')


module.exports = {
    index,
    new: newGame,
    show,
    create,
    edit,
    update,
    delete: deleteGame
}

async function index(req, res) {
    try{
        const response = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_SECRET,
            grant_type: "client_credentials"
        })
        const allGames = await axios.post('https://api.igdb.com/v4/games', {}, {
            body: {
                fields: 'name',
                limit: 10
            },
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: 'Bearer ' + response.data.access_token
            }
        })
        
        console.log(allGames, '<---- Should be names of games')
        console.log(typeof(allGames.data))
//         const allGames = await Game.find({}).sort('name')
//         res.render('games/index', {
//             games: allGames
//         })
    res.render('games/index', {
        games: allGames.data
        }
    )

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

async function edit(req,res) {
    try{
        const oneGame = await Game.findById(req.params.id)
        res.render('games/edit',{ 
        game: oneGame
    })
    } catch(err){
        console.log(err)
        res.send(err)
    }
}

async function update(req,res) {
    try{
        console.log(req.body, "<---req.body")
        req.body.upcoming = !!req.body.upcoming
        const oneGame = await Game.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/games/${oneGame._id}`)
    } catch(err){
        console.log(err)
        res.send(err)
    }
}
async function deleteGame(req,res){
    try{
        await Game.findByIdAndDelete(req.params.id)
        res.redirect('/games')
    } catch(err){
        console.log(err)
        res.send(err)
    }
}