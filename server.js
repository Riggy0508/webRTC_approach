const express = require('express');
const { socket } = require('socket.io');
//Using an app variable in order to run the above express server
const app = express();
//Server is used for socket.io purposes in order for it to communicate with it
const server = require('http').Server(app);
// We are using socket io so that it can handle the communication between the server
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomID: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // socket.on('disconnect', () => {
    //   socket.to(roomId).broadcast.emit('user-disconnected', userId);
    // });
  });
});

server.listen(3000);
