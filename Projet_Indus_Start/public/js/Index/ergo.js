/* Cette variable globale matérialise le comportement que doit avoir l'utilisateur.
  true -> il doit scroll
  false -> il doit click */
var toscroll = true;
var displayed = false;

function createScrollText (){
  CONST.SCROLL = {
    text: "Scrollez pour avancer",
  };
  CONST.SCROLL.D3 = svg.append("text")
                      .attr("class", "scroll")
                      .text(CONST.SCROLL.text)
                      .attr("font-size", Math.round(14*CONST.VUE.WIDTH/1138)+"px")
                      .attr("x",0.2*CONST.VUE.WIDTH)
                      .attr("y",0.2*CONST.VUE.HEIGHT)
                      .attr("text-anchor","middle")
                      .attr("opacity", 0)
  displayed=true;
    //d3.select(window).on("click", function (){})
}

d3.select(window).on("mousemove", function (){
  if (displayed){
    if (toscroll){
      CONST.SCROLL.D3.attr("x", d3.event.x-(CONST.VUE.WIDTH*26/100));//CONST.SCROLL.x)
      CONST.SCROLL.D3.attr("y", d3.event.y+20);//CONST.SCROLL.y)
    }
    CONST.SCROLL.D3.attr("opacity", 1);
    CONST.SCROLL.D3.transition()
      .delay(CONST.TIMETRANSITION)
      .duration(CONST.TIMETRANSITION)
      .attr("opacity", 0)
      /*.on("end", function (){
        CONST.SCROLL.D3.remove();
        displayed=false;
      })*/
      setTimeout(function (){
        CONST.SCROLL.D3.remove();
        displayed=false;
      }, 2.5*CONST.TIMETRANSITION)
  }

})

function createClickText (){
  CONST.SCROLL = {
    text: "Cliquez pour faire un choix",
  };
  CONST.SCROLL.D3 = svg.append("text")
                        // Mêmes propriétés css -> même classe
                      .attr("class", "scroll")
                      .text(CONST.SCROLL.text)
                      .attr("font-size", Math.round(14*CONST.VUE.WIDTH/1138)+"px")
                      .attr("x",0.2*CONST.VUE.WIDTH)
                      .attr("y",0.2*CONST.VUE.HEIGHT)
                      .attr("text-anchor","middle")
                      .attr("opacity", 1)
  displayed=true;
}

d3.select(window).on("click", function (){
  if (toscroll){
    createScrollText();
  }
})

// La gestion du click qd l'utilisateur scroll a lieu dans scroller.js dans l'instruction d3.select(window).on(...)
