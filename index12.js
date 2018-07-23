var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var range;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    range = req.range;
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    var num;
    socket.on('number', (msg) => {
        num = Number(msg);
        console.log('msg: ' + msg);
        console.log('num: ' + num);
    });
    socket.on('randomNumber', () => {
        setInterval(function (num){
            
            console.log(num);
            let rn = Math.round(Math.random() * (100));
            while( rn > num ) {
                rn = Math.round(Math.random() * (100));
            }
            // request.get('')
            console.log(rn);
            io.emit('randomNumber', rn);
        }, 1000);
    });
});

http.listen(3000, () => {
    console.log('Listening to port *:3000');
});




// if (range < 10) {
//     io.emit('chat message', (int)(Math.random() * 10));
// } else {
    
// }