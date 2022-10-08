const mongoose = require('mongoose')

const Schema = mongoose.Schema

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    }
}, {timestamps: true })

module.exports = mongoose.model('QBank', questionSchema)