var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', ()=> {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, () => {
    console.log('Listening to port *:3000');
});