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

io.sockets.on('connection', function (socket) {
  
});

server.listen(8080);
console.log("Serveur prêt !")
