const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;

io.sockets.on('connection', (socket) => {
  socket.on('join', (msg) => {
    console.log(`[Request] join roomId: ${msg}`)
    socket.join(msg);
  });

  socket.on('send', (msg) => {
    console.log(`[Request] ${msg}`)
    console.log(`roomId ${msg.roomId}`)
    console.log(`jsonMessage ${msg.jsonMessage}`)
    socket.broadcast.to(msg.roomId).emit('receive', msg.jsonMessage);
    console.log('[Response] broadcasted')
  });

  socket.on('sendWithMySelf', (msg) => {
    console.log(`[Request] ${msg}`)
    console.log(`roomId ${msg.roomId}`)
    console.log(`jsonMessage ${msg.jsonMessage}`)
    io.emit("receive", msg.jsonMessage) 
    console.log('[Response] broadcasted with sender')
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('ping', () => {
    io.emit('pong', {ok: true});
  });
});

app.get('/' , (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.listen(PORT, '0.0.0.0', () => {
  console.log('server listening. Port:' + PORT);
});
