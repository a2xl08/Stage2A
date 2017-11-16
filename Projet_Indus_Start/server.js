var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express')
var app = express();
var server = http.createServer(app);

// Chargement des pages
app.get("/", function (req, res){
  fs.readFile('./index.html', 'utf-8', function(error, content) {
      console.log("New User")
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
})
.get("/index.html", function (req, res){
  fs.readFile('./index.html', 'utf-8', function(error, content) {
      console.log("New User")
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
})
.get("/index_gdecran.html", function (req, res){
  fs.readFile('./index_gdecran.html', 'utf-8', function(error, content) {
      console.log("New User")
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
})
.get("/reseau.html", function (req, res){
  fs.readFile('./reseau.html', 'utf-8', function(error, content) {
      console.log("Master connected")
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
})
.get("/reseau_gdecran.html", function (req, res){
  fs.readFile('./reseau_gdecran.html', 'utf-8', function(error, content) {
      console.log("Slave connected")
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
})

app.use(express.static(__dirname+"/public"));

// Chargement de socket.indexio
var io = require('socket.io').listen(server);
// Fonction de retransmission
function transmit(socket, type){
  socket.on("push "+type, function (message){
    console.log(type);
    socket.broadcast.emit("pull "+type, message)
  })
}

io.sockets.on('connection', function (socket) {
  // Pour chaque message push reçu, on envoie un message pull

  transmit(socket, "reload");
  transmit(socket, "index");
  transmit(socket, "reseau");
  transmit(socket, "Next");
  transmit(socket, "Prev");
  transmit(socket, "mouseover node");
  transmit(socket, "mouseout node");
  transmit(socket, "click node");
  transmit(socket, "close node fiche");
  transmit(socket, "mouseover membrane");
  transmit(socket, "mouseout membrane");
  transmit(socket, "click stories");
  transmit(socket, "close stories");
  transmit(socket, "newtheme");
  transmit(socket, "backtheme");
  transmit(socket, "story");
  transmit(socket, "closestory");
  transmit(socket, "storycircle mouseover");
  transmit(socket, "storycircle mouseout");
});

server.listen(8080);
console.log("Serveur prêt !")
