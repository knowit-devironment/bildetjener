var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var appsecret = process.env.APP_SECRET || 'firstLineOfDefense101'; 

var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastImage;

var options = {
    inflate: true,
    limit: '100kb',
    type: '*/*'
  };

app.use(bodyParser.raw(options));

http.listen(3000, function(){
    console.log('listening on *:3000');
});

app.post("/image", function(req, res) {
	lastImage = req.body.toString('base64');
    io.emit('image', lastImage, { for: 'everyone' });
    res.send("OK");
    console.log("emitting image!");
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/sistebilde', function(req, res){
  res.send(lastImage);
});



io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
	
	socket.emit('image', lastImage);

    socket.on("images", function(msg) {
        console.log("image: " + msg);
    });
});

io.on('images', function(message) {
    console.log('on images' + message);
});


