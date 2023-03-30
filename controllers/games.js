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
        const allGames = await axios.post('https://api.igdb.com/v4/games', 
            'fields *; limit 50;', 
            {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: 'Bearer ' + response.data.access_token

            }
        })
        const ids = allGames.data.map(game => game.id);

         // Make a new Axios request to retrieve the names using the IDs
        const response2 = await axios.post('https://api.igdb.com/v4/games',
            `fields name; where id=(${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    Authorization: 'Bearer ' + response.data.access_token,
                    'Content-Type': 'text/plain'
        }
      }
    );
        
        console.log(response2, '<---- Should be names of games')
        console.log(typeof(allGames.data))
//         const allGames = await Game.find({}).sort('name')
//         res.render('games/index', {
//             games: allGames
//         })
    res.render('games/index', {
        games: response2.data
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
        const response = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_SECRET,
            grant_type: "client_credentials"
        })
        const oneGame = await axios.post('https://api.igdb.com/v4/games', 
        `fields *; where id=${req.params.id};`, 
        {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            Authorization: 'Bearer ' + response.data.access_token
            }
        })
        const gameCover = await axios.post('https://api.igdb.com/v4/covers',
            `fields url; where id=${oneGame.data[0].cover};`,
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    Authorization: 'Bearer ' + response.data.access_token
                }
            })
        const gameDeveloperId = await axios.post('https://api.igdb.com/v4/involved_companies',
        `fields company; where id=${oneGame.data[0].involved_companies[0]}`,
        {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: 'Bearer ' + response.data.access_token
            }
        })
        const gameDeveloper = await axios.post('https://api.igdb.com/v4/companies',
        `fields name; where id=${gameDeveloperId.data[0].company}`)
    console.log(gameDeveloperId.data[0])
    console.log(gameCover.data[0])
    console.log(oneGame.data)
        res.render('games/show', {
            game: oneGame.data[0],
            cover: gameCover.data[0],
            developer: gameDeveloper.data[0]
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