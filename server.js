const express = require('express');
const { socket } = require('socket.io');
//Using an app variable in order to run the above express server
const app = express();
//Server is used for socket.io purposes in order for it to communicate with it
const server = require('http').Server(app);
// We are using socket io so that it can handle the communication between the server
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
//console.log(uuidV4);

//the below let's us know how we are gonna handle the view's in our case we have used ejs in order to do so.
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Working on the router to our homepage, we are now gonna use the route and requets and order to get the response from the server

app.get('/', (req, res) => {
  //here we will get the dynamic room id in order for our user's to enter it.
  //res.redirect(`/${roomId}`)
  res.redirect(`/${uuidV4()}`);
  //example: 1. 983676b3-df1c-4f1b-85ac-d93f3dd50d0e   2. ae6c56a3-c7a7-477b-9421-80f0dc65294c
});
//Setting up the room for our applications
app.get('/:room', (req, res) => {
  res.render('room', { roomID: req.params.room });
});

//the below socket connections notifies us each time someone tries to enter our room. We have set different event's in order to handle different sceneario
//for our below event we are gonna listen to our socket if someone join's a room and if a user join a room we are gonna use that room-id and user-id in order to
// display there respected video via calling methods from our script.js file
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // socket.on('disconnect', () => {
    //   socket.to(roomId).broadcast.emit('user-disconnected', userId);
    // });
  });
});

server.listen(3000); // this allows our server to listen to our request at port 3000. ex: localhost:3000
// By using the above method o≈ne can notice that even when the server is not running we will still be communicate with other
//people as it directly communicate's with the person's computer. So we don't have to worry about sending the traffic through server
// Sever is just used to create the room's
