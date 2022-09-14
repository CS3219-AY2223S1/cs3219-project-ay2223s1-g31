import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

import io from './socket.js'
import { createMatch } from './controller/match-controller.js'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const router = express.Router()
router.get('/', (req, res) => { res.send('Hello World from matching-service')})
router.post('/', createMatch)

app.use('/api/matching', router).all((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

const PORT = process.env.PORT || 8001

const httpServer = createServer(app)
io.init(httpServer)
io.get().on('connection', (socket) => {
    console.log(`New client connected ${socket.id}`)

    socket.on('code-event1', ({ room_id, new_code }) => {
        io.get().sockets.in(room_id).emit('code-event', { new_code })
    })
})
httpServer.listen(PORT, () => {
    console.log(`matching-service listening on port ${PORT}`)
})
