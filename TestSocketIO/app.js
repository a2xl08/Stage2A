var http = require('http');
var fs = require('fs');

// Chargement du fichier slave.html affiché au client
var server = http.createServer(function(req, res) {
  if (req.url==="/master.html"){
    fs.readFile('./master.html', 'utf-8', function(error, content) {
        console.log("Master connected")
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
  } else {
    fs.readFile('./slave.html', 'utf-8', function(error, content) {
        console.log("New slave connected")
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
  }
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
  // On reçoit un message de master
    socket.on("push", function (message){
      console.log("Nouveau message : " + message);
      // On met à jour le slave
      socket.broadcast.emit("pull", message);
    })
});

server.listen(8080);
console.log("Serveur prêt !")
