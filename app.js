var app = require('express')();
var server = require('http').createServer(app);
var fs = require('fs');
var io = require('socket.io').listen(server);
var serveStatic = require('serve-static');

var port = process.env.PORT || 8080;

//users will store pseudo and id of connected users
var users = {user:[]};

// Server is running
console.log('Chat is running on http://localhost:' + port);

// We give access to /public and /
app.use(serveStatic(__dirname + '/'));
app.use(serveStatic(__dirname + '/public/'));

// We load index.html at root => should be set to '/chat' once on server, if url IP/chat
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// We use socket.io for real-time communication
io.sockets.on('connection', function (socket, pseudo) {

    // We store the login in the session
    socket.on('pseudoConnecte', function(pseudo) {
        socket.pseudo = pseudo;
        var id = socket.id;
        console.log(pseudo + ' is connected with id: ' + id);
        // When someone connects, we send a message to all other connected users
        socket.broadcast.emit('messageNouvelleConnexion', pseudo + ' joined the conversation');
        // We send the connected users list to client
        users.user.push({
            "pseudo": pseudo,
            "id": id
          });
        io.sockets.emit('messageListeUtilisateurs', users);
    });

    // When we get a message (click on "Send" button), we send it to connected users
    socket.on('messageClient', function (message) {
        io.sockets.emit('messageServeur', message);
    });

    // When we get private message from client, we send it to the chosen user
    socket.on('messagePriveClient', function(data){
      socket.broadcast.to(data.id).emit('messagePriveServeur', data.message);
      socket.emit('messagePriveServeur', data.message);
    });

    // When we get a boutonMouette (click on "mouette" button), we broadcast a message
    socket.on('boutonSon', function(data){
      if(data.recipient === 'everyone') {
        io.sockets.emit('messageSon', socket.pseudo + ' sent a ' + data.son +' sound to ' + data.recipient);
        socket.broadcast.emit('son', data);
      }
      else {
        socket.emit('messageSon', socket.pseudo + ' sent a ' + data.son +' sound to ' + data.recipient);
        socket.broadcast.to(data.recipientId).emit('messageSon', socket.pseudo + ' sent a ' + data.son +' sound to ' + data.recipient);
        socket.broadcast.to(data.recipientId).emit('son', data);
      }
    });

    socket.on('disconnect', function(){
      // We remove the disconnected user from users
      for (var i = 0; i < users.user.length; i++) {
        if (users.user[i].id === socket.id) {
          users.user.splice(i, 1);
          break;
        }
      }
      console.log(socket.pseudo + ' disconnected')
      // When someone disconnects, we send a message to all other connected users
      socket.broadcast.emit('messageDeconnexion', socket.pseudo + ' left the conversation');
      // We send the new connected users list to client (io.sockets.emit send to all connected clients)
      io.sockets.emit('messageListeUtilisateurs', users);
    });
});

server.listen(port);
