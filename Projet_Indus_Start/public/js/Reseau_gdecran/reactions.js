socket.on("pull Next", function (message){
  simulation.nextSection();
})

socket.on("pull Prev", function (message){
  simulation.previousSection();
})
