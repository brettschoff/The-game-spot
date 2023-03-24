const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        text: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
        userPhoto: String,
        userName: String,
        date: Date,
        rating: String,
        edited: {
            type: Boolean,
            default: false
        }
    }
)

const gameSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        photo: String,
        developer: String,
        esrbRating: String,
        review: [reviewSchema]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Game', gameSchema)