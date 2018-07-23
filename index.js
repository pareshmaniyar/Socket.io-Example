// ws://localhost:8099s
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
const WebSocket = require('ws');
const wss = new WebSocket('wss://api.bitfinex.com/ws/');
var channelId = null;
const CHANNEL_PAYLOADS = {
  ticker_trading: {
    "event": "subscribe",
    "channel": "ticker",
    "symbol": "tBTCUSD"
  }, ticker_funding: {
    "event": "subscribe",
    "channel": "ticker",
    "symbol": "fUSD"
  }, trades_trading: {
    "event": "subscribe",
    "channel": "trades",
    "symbol": "tBTCUSD"
  }, trades_funding: {
    "event": "subscribe",
    "channel": "trades",
    "symbol": "fUSD"
  }, books_trading: {
    "event": "subscribe",
    "channel": "book",
    "symbol": "tBTCUSD",
    "prec": "P0",
    "freq": "F0",
    "len": 25
  }, books_funding: {
    "event": "subscribe",
    "channel": "book",
    "symbol": "fUSD",
    "prec": "P0",
    "freq": "F0",
    "len": 25
  }, raw_books: {
    "event": "subscribe",
    "channel": "book",
    "pair": "tBTCUSD",
    "prec": "R0"
  }, candles: {
    "event": "subscribe",
    "channel": "candles",
    "key": "trade:1m:tBTCUSD"
  }, default: {
    "event": "ping"
  }
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  range = req.range;
});

wss.on('message', (data) => {
  // var objData = JSON.parse(data);
  // console.log('//////////////////////////'+ objData);
  console.log(data);
});

io.on("connection", (socket) => {
    // Display a connected message
    console.log("User Connected!");

    // Lets force this connection into the lobby room.
    socket.join('lobby');

    // When we receive a message...
    socket.on("message", (data) => {
        // We need to just forward this message to our other guy
        // We are literally just forwarding the whole data packet
        console.log(data + ': socket triggered ');
        if (data == "Books") {
          wss.send(JSON.stringify({
            "event": "subscribe",
            "channel": "book",
            "symbol": "tBTCUSD",
            "prec": "P0",
            "freq": "F0",
            "len": 25
          }));
        }
    });

    socket.on("disconnect",(data) => {
        // We need to notify Server 2 that the client has disconnected
        // other_server.emit("message","UD," + socket.id);
        console.log("User-Client Disconnected!");

        wss.send(JSON.stringify({
          "event": "unsubscribe",
          "chanId": channelId
        }));
        // Other logic you may or may not want
        // Your other disconnect code here
    });
});

http.listen(3000, () => {
  console.log('Listening to port *:3000');
});