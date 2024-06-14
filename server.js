const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})


app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('static'))

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-disconnected', userId)
    
    socket.on('message', (message) => {
      
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})
PORT =process.env.PORT|| 80;

server.listen(PORT,()=>{
  console.log("server is listebibg");
})
