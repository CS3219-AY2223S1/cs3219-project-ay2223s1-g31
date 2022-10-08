const express = require('express')
const QBank = require('../models/question-model')
const {
    createQ,
    getEQ,
    getMQ,
    getHQ,
} = require('../controller/question-controller')

const router = express.Router()

// test
router.get('/', (req, res) => {
    res.json({mssg: 'hello world'})
})

// get ez question
router.get('/1', getEQ)

// get medium question
router.get('/2', getMQ)

// get hard question
router.get('/3', getHQ)

// post question
router.post('/', createQ)

module.exports = router