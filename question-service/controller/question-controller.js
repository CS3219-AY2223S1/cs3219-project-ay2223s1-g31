const QBank = require('../models/question-model')

// get ez question
const getEQ = async (req, res) => {
    const q = await QBank.aggregate([
        { $match: { difficulty: 'easy' } },
        { $sample: { size: 1}}
    ])
    res.status(200).json(q)
}

// get medium question
const getMQ = async (req, res) => {
    const q = await QBank.aggregate([
        { $match: { difficulty: 'medium' } },
        { $sample: { size: 1}}
    ])
    res.status(200).json(q)
}

// get hard question
const getHQ = async (req, res) => {
    const q = await QBank.aggregate([
        { $match: { difficulty: 'hard' } },
        { $sample: { size: 1}}
    ])
    res.status(200).json(q)
}

// create question
const createQ = async (req, res) => {
    const {title, difficulty, question} = req.body

    try {
        const q = await QBank.create({title, difficulty, question})
        res.status(200).json(q)
    } 
    catch (error) { res.status(400).json({error: error.message}) }
}

module.exports = {
    getEQ, 
    createQ, 
    getMQ, 
    getHQ
}