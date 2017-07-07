// Création des données de la figure initiale
CONST.FIGINIT = {};
CONST.FIGINIT.TITRE = {
  x: function (){
         var textpos = this.getBoundingClientRect();
         return CONST.VUE.WIDTH/2 - (textpos.right - textpos.left)/2
       }, 
  y: CONST.VUE.HEIGHT/2, 
  class: "Initfig Titre",
  text: "Vi(c)e Organique"
}
CONST.FIGINIT.POINTS = [
  {
    x: 0.5*CONST.VUE.WIDTH,
    y: 0.75*CONST.VUE.HEIGHT,
    dx: 30,
    dy: -20,
    text: "Lobby"
  }, 
  {
    x: 0.25*CONST.VUE.WIDTH,
    y: 0.66*CONST.VUE.HEIGHT,
    dx: 60,
    dy: -5,
    text: "Réseau"
  }, 
  {
    x: 0.45*CONST.VUE.WIDTH,
    y: 0.3*CONST.VUE.HEIGHT,
    dx: 0,
    dy: 10,
    text: "Climat"
  }, 
  {
    x: 0.7*CONST.VUE.WIDTH,
    y: 0.69*CONST.VUE.HEIGHT,
    dx: -5,
    dy: -5,
    text: "Europe"
  }
];


function createInitFigure (){
  CONST.FIGINIT.TITRE.D3 = svg.append("text")
    .attr("class", CONST.FIGINIT.TITRE.class)
    .text(CONST.FIGINIT.TITRE.text)
  CONST.FIGINIT.TITRE.D3
    .attr("x", CONST.FIGINIT.TITRE.x)
    .attr("y", CONST.FIGINIT.TITRE.y)
    .attr("opacity", 0)
  CONST.FIGINIT.POINTS.forEach(function (p){
    p.D3 = svg.append("text")
          .text(p.text)
          .attr("class", "Initfig texte")
          .attr("x", p.x)
          .attr("y", p.y)
          .attr("opacity", 0)
  })
  for (var i=0; i<4; i++){
    for (var j=i+1; j<4; j++){
      svg.append("line")
        .attr("class", "Initfig")
        .attr("opacity", 0)
        .attr("x1", CONST.FIGINIT.POINTS[i].x+CONST.FIGINIT.POINTS[i].dx)
        .attr("x2", CONST.FIGINIT.POINTS[j].x+CONST.FIGINIT.POINTS[j].dx)
        .attr("y1", CONST.FIGINIT.POINTS[i].y+CONST.FIGINIT.POINTS[i].dy)
        .attr("y2", CONST.FIGINIT.POINTS[j].y+CONST.FIGINIT.POINTS[j].dy)
    }
  }
  CONST.FIGINIT.LINES = {D3: svg.selectAll("line.Initfig")};

}

function displayInitFigure (){
  if (document.body.scrollTop===0){
    createInitFigure();

    d3.selectAll(".Initfig")
      .transition()
      .duration(1000)
      .attr("opacity", 1);
  } else {
    if (CONST.FIGINIT.TITRE.D3.attr("opacity") === "1"){
      setTimeout( function (){d3.selectAll(".Initfig").remove();}, 1200 )
    }
    // On n'affiche pas le texte SCROLL
    d3.select(window).on("click", function (){})

    d3.selectAll(".Initfig")
      .transition()
      .duration(1000)
      .attr("opacity", 0);
  }
}






// Création du texte SCROLL
CONST.SCROLL = {
  text: "SCROLL !",
  x: 0*CONST.VUE.WIDTH,
  y: 0.6*CONST.VUE.HEIGHT
};
CONST.SCROLL.D3 = svg.append("text")
                    .attr("class", "scroll")
                    .text(CONST.SCROLL.text)
                    .attr("x", CONST.SCROLL.x)
                    .attr("y", CONST.SCROLL.y)
                    // 1138 est la taille de VUE sur mon navigateur en plein écran, dans ce cas -> taille 200
                    .attr("font-size", Math.round(200*CONST.VUE.WIDTH/1138)+"px")
                    .attr("opacity", 0)

d3.select(window).on("click", function (){
  if (document.body.scrollTop===0){
    CONST.SCROLL.D3.attr("opacity", 1);
  }
  d3.select(window).on("click", function (){})
  d3.select(window).on("scroll.scroller", function (){
    CONST.SCROLL.D3.attr("opacity", 0);
    position();
  })
})

