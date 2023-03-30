const Game = require('../models/game')
const axios = require('axios');

module.exports = {
    show,
    api
}

async function show(req, res) {
    try {
        const upcomingGames = await Game.find({'upcoming': true})
        console.log(upcomingGames)
        res.render('index', {
            upcoming: upcomingGames
        })
    } catch(err) {
        console.log(err)
        res.send(err)
    }
}

async function api(req,res) {
    try{
        const response = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_SECRET,
            grant_type: "client_credentials"
        })
        process.env.TWITCH_ACCESS_TOKEN = response.access_token
        console.log(response.data)
        res.redirect('/')
    } catch(err){
        console.log(err)
        res.send(err)
    }
}