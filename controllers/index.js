const Game = require('../models/game')

module.exports = {
    show
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