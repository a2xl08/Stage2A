var toscroll=true;
var displayed=false;
CONSTANTS.SCROLL = {};
CONSTANTS.TIMETRANSITION = 300;

function createScrollText (){
  CONSTANTS.SCROLL = {
    text: "Scrollez pour avancer",
  };
  CONSTANTS.SCROLL.D3 = canvas.append("text")
                      .attr("class", "scroll")
                      .text(CONSTANTS.SCROLL.text)
                      .attr("font-size", Math.round(14*CONSTANTS.VUE.WIDTH/1138)+"px")
                      /*.attr("x",0)
                      .attr("y",0)*/
                      .attr("text-anchor","middle")
                      .attr("opacity", 0)
  displayed=true;
}

d3.select(window).on("mousemove", function (){
  if (displayed){
    if (toscroll){
      CONSTANTS.SCROLL.D3.attr("x", d3.event.x-(CONSTANTS.VUE.WIDTH*26/100));//CONSTANTS.SCROLL.x)
      CONSTANTS.SCROLL.D3.attr("y", d3.event.y+20);//CONSTANTS.SCROLL.y)
    }
    CONSTANTS.SCROLL.D3.attr("opacity", 1);
    CONSTANTS.SCROLL.D3.transition()
      .delay(CONSTANTS.TIMETRANSITION)
      .duration(CONSTANTS.TIMETRANSITION)
      .attr("opacity", 0)
      setTimeout(function (){
        CONSTANTS.SCROLL.D3.remove();
        displayed=false;
      }, 2.5*CONSTANTS.TIMETRANSITION)
  }

})

function createClickText (){
  CONSTANTS.SCROLL = {
    text: "Cliquez sur les cellules",
  };
  CONSTANTS.SCROLL.D3 = canvas.append("text")
                        // Mêmes propriétés css -> même classe
                      .attr("class", "scroll")
                      .text(CONSTANTS.SCROLL.text)
                      .attr("font-size", Math.round(14*CONSTANTS.VUE.WIDTH/1138)+"px")
                      .attr("x",0.2*CONSTANTS.VUE.WIDTH)
                      .attr("y",0.1*CONSTANTS.VUE.HEIGHT)
                      .attr("text-anchor","middle")
                      .attr("opacity", 1)
  displayed=true;
}

d3.select(window).on("click", function (){
  if (toscroll){
    createScrollText();
  }
})
