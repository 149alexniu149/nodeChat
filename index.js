var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser  = require('body-parser');
var people = {};
var room = {};
var username;
var RID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/entry.html');
});

app.post('/', function(req, res){
  username = req.body.username;
  RID = req.body.RID;
  if(typeof RID === 'undefined' || typeof username == 'undefined'){
    res.sendFile(__dirname + '/entry.html');  
  }else{
    res.sendFile(__dirname + '/index.html');
  }
});

io.on('connection', function(socket){
  people[socket.id] = username;
  room[socket.id] = RID;
  console.log(room[socket.id]);
  socket.join(room[socket.id]);
  io.to(room[socket.id]).emit('chat message', username + ' connected');
  socket.on('chat message', function(msg){
    io.to(room[socket.id]).emit('chat message', people[socket.id] + ": " + msg);
    //socket.broadcast.to(people[socket.id]).emit('chat message', people[socket.id] + ": " + msg);  
  });
  socket.on('disconnect', function(){
    io.to(room[socket.id]).emit('chat message', people[socket.id] + ' disconnected.');
    socket.leave(room[socket.id]);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});