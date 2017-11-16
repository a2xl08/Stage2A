window.onbeforeunload = function(){
  socket.emit("push reload", "");
  window.scrollTo(0,0);
}

socket.on("pull reload", function (message){
  window.location.reload();
})

socket.on("pull Next", function (message){
  simulation.nextSection();
})

socket.on("pull Prev", function (message){
  simulation.previousSection();
})
