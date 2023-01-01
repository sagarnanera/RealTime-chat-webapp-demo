const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    // console.log(__dirname+'/src/index.html');
    res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', (socket) => {
    // console.log(socket);
    const user = socket.handshake.query.userName;
    console.log(user, 'connected');

    socket.broadcast.emit('new connection', `${user} connected`);


    socket.on('chat message', (obj) => {
        // console.log('message arrived : ', obj);
        // io.emit("chat message", obj.msg)
        socket.broadcast.emit("chat message", obj);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} user left`);
        socket.broadcast.emit("user left", `${socket.id} left`);
    });

    socket.on('typing', (user) => {
        console.log(user, 'typing....');
        socket.broadcast.emit("typing", user);
    })


});

server.listen(3000, () => {
    console.log('listening on *:3000');
});