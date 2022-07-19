import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import router from './src/routes/index.js'
import dotenv from "dotenv";
dotenv.config()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: '*'
    }
})
import socketIo from './src/socket/index.js'
socketIo(io)

const port = 5000
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Muhammad Amri, web server with express")
})
app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))

server.listen(port, (() => console.log(`Listening on port ${port}`)))