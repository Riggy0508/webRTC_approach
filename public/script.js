const socket = io('/');
const videoGrid = document.getElementById('video-grid');

//The below peer API helps us to listen to different uesr's that are connected to our port 3001, which will helps us connect with other peers available on the network
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
});
const myVideo = document.createElement('video');
//We don't wanna listen to our own video while been on a call. So as soon as we join a room we are gonna make ourself mute.
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    // below code let's us know when a new user have connected and once connected we are gonna fetch there video and audio via calling the function mentioned
    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  });
//The below code makes sure that once a user is disconnected from a stream we will no longer be able to see that user's stream onto the webpage
socket.on('user-disconnected', (userId) => {
  if (peers[userId]) peers[userId].close();
});

//This part of the code helps us in identifing a new user id and help us in joining that user to a new room.
myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}
