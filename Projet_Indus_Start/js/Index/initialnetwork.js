// Ce script contient les fonctions nécessaires pour afficher le réseau du fond dans le svg

// Constantes d'Affichage
CONST.INTROLOGO = {};
CONST.INTROLOGO.DATA = {};
CONST.INTROLOGO.CIRCLECURVE = d3.curveBasisClosed;
CONST.INTROLOGO.NBPOINTS = 50;
CONST.INTROLOGO.JITTER = 0.01;
CONST.INTROLOGO.PHI = Math.PI * 4;
CONST.INTROLOGO.RADIUS_RANGE = [15, 30];

// pour le déssin des noeuds
var radialLine = d3.radialLine()
  .angle(function(d){ return d.angle; })
  .radius(function(d){ return d.radius; })
  .curve(CONST.INTROLOGO.CIRCLECURVE);
var circlePoints = function(radius, nbPoints){
  nbPoints = nbPoints || CONST.INTROLOGO.NBPOINTS;
  var radiusJitter = CONST.INTROLOGO.JITTER;
  var stepAngle = CONST.INTROLOGO.PHI/nbPoints;
  var points = [];
  for(var i=0; i<nbPoints; i++){
    var angle = stepAngle*i;

    var jitterRadius = function(){ return Math.random()>0.5 ? 1:-1 }() * Math.round(
        (radius*radiusJitter)*(Math.random())
    );
    points.push({
      // précalcul des cosinus et sinus pour éviter d'avoir à le faire
      // lors du calcul de la membrane
      cosAngle: Math.cos(angle),
      sinAngle: Math.sin(angle),
      angle: angle,
      radius: radius + jitterRadius,
    });
  }
  return points;
};

// Chargement des données
var spendingScale; // définie après l'import des données de la figure dans intro.js
var createdataset = function (){
  var dataset = CONST.INTROLOGO.DATA["Noeuds"];
  for (var i=0; i<dataset.length; i++){
    console.log(spendingScale(parseInt(dataset[i]["Dépenses Lobby (€)"])))
    dataset[i].points = circlePoints(spendingScale(parseInt(dataset[i]["Dépenses Lobby (€)"])));
    dataset[i].kernelPoints = circlePoints(3);
  }
  return dataset;
}

// Déssin de la figure
var drawfig = function (nodes, links){
  var $nodes = svg
    .selectAll('.node')
    .data(nodes)
  var $links = svg
    .selectAll('.link')
    .data(links)

  // Création des courbes

  // Dessin des noeuds
  var nodeenter = $nodes.enter()
    .insert("g", ":first-child")
    .classed("node", true)
    .attr("id", function (d){return "nodeintro"+d.id})
    .attr("transform", function (d){return "translate("+d.x+", "+d.y+")"})
  nodeenter.append("path")
    .classed('circle-membrane', true)
    .attr("fill", "white")
    .attr('d', function(d){
      return radialLine(d.points);
    });
  nodeenter.append("path")
    .classed('circle-kernel', true)
    .attr("fill", "red")
    .attr('d', function(d){
      return radialLine(d.kernelPoints);
    });

}

// Chargement de la simulation - force layout
var configSimulation = function (simulation){
  simulation.nodes(nodes)
    .force("center", d3.forceCenter(CONST.VUE.WIDTH/2,CONST.VUE.HEIGHT/2))
    .force("collide", d3.forceCollide().radius(function (d){
      console.log(spendingScale(parseInt(d["Dépenses Lobby (€)"])))
      return 2.3*spendingScale(parseInt(d["Dépenses Lobby (€)"]));
    }))
  simulation.on("tick", function (){
    console.log("tick")
    drawfig(nodes, links);
  });
}
