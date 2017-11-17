// Ce script contient les fonctions nécessaires pour afficher le réseau du fond dans le svg

// Constantes d'Affichage
CONST.INTROLOGO = {};
CONST.INTROLOGO.DATA = {};
CONST.INTROLOGO.CIRCLECURVE = d3.curveBasisClosed;
CONST.INTROLOGO.NBPOINTS = 50;
CONST.INTROLOGO.JITTER = 0.02;
CONST.INTROLOGO.PHI = Math.PI * 4;
CONST.INTROLOGO.RADIUS_RANGE = [24, 70];
CONST.INTROLOGO.CIRCLEKERNEL = 3;
CONST.INTROLOGO.LINK_KERNEL_SCALE = 2.33;
CONST.INTROLOGO.LINK_END_SCALE = 0.2;
var baseLinkWidth = CONST.INTROLOGO.CIRCLEKERNEL * CONST.INTROLOGO.LINK_KERNEL_SCALE - 2;
var endLinkWidth = baseLinkWidth*CONST.INTROLOGO.LINK_END_SCALE;
CONST.LINK_DEFAULT_BODY = [
  { at: 0.0, width: baseLinkWidth, offset: 0 },
  { at: 0.15, width: baseLinkWidth*0.5, offset: 0 },
  { at: 0.3, width: endLinkWidth, offset: baseLinkWidth*0.33 },
  { at: 0.75, width: endLinkWidth, offset: -3 },
  { at: 1.0, width: endLinkWidth, offset: 0}
];

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
// Pour le dessin des liens
var radToDeg = function(rad){ return (rad*180)/Math.PI; };
var degToRad = function(deg){ return (deg*Math.PI)/180; };
var getNormalAngle = function(a,b){
  var angle = radToDeg(Math.atan2(b.y-a.y, b.x-a.x));
  return degToRad(angle - 90);
};
var areaPoints = function(link){
  link.body = link.body || CONSTANTS.LINK.DEFAULT_BODY;
  var points = link.body;
  var source = link.source;
  var target = link.target;
  var tgt = {
    x: nodes[CONST.INTROLOGO.DATA.indexor[link.target]].x - nodes[CONST.INTROLOGO.DATA.indexor[link.source]].x,
    y: nodes[CONST.INTROLOGO.DATA.indexor[link.target]].y - nodes[CONST.INTROLOGO.DATA.indexor[link.source]].y
  };

  var normalAngle = getNormalAngle({x:0,y:0}, tgt);

  var cosNormalAngle = Math.cos(normalAngle);
  var sinNormalAngle = Math.sin(normalAngle);

  var x = function(pt){
    return tgt.x*pt.at + pt.offset*cosNormalAngle;
  };

  var x0 = function(pt){
    return pt.x - pt.width*cosNormalAngle;
  };

  var x1 = function(pt){
    return pt.x + pt.width*cosNormalAngle;
  };

  var y = function(pt){
    return tgt.y*pt.at + pt.offset*sinNormalAngle;
  };

  var y0 = function(pt){
    return pt.y - pt.width*sinNormalAngle;
  };

  var y1 = function(pt){
    return pt.y + pt.width*sinNormalAngle;
  };
  var i, n = points.length, _points = [], pt;
  for(i = 0; i < n; i++){
    pt = points[i];
    pt.y = y(pt);
    pt.x = x(pt);
    _points.push({
      x0: x0(pt), x1: x1(pt),
      y0: y0(pt), y1: y1(pt)
    });
  }
  return _points;
};
// fonction permettant de convertir les coordonnées générées par la
// fonction `areaPoints` en chemin SVG (path)
var areaPath = d3.area()
  .curve(d3.curveBasis)
  .x0(function(pt){return pt.x0; })
  .x1(function(pt){return pt.x1; })
  .y0(function(pt){return pt.y0; })
  .y1(function(pt){return pt.y1; });

// Chargement des données
var spendingScale; // définie après l'import des données de la figure dans intro.js
var createdataset = function (){
  var dataset = CONST.INTROLOGO.DATA["Noeuds"];
  for (var i=0; i<dataset.length; i++){
    dataset[i].points = circlePoints(spendingScale(parseInt(dataset[i]["Dépenses Lobby (€)"])));
    dataset[i].kernelPoints = circlePoints(CONST.INTROLOGO.CIRCLEKERNEL);
  }
  return dataset;
}
var createdatalinks = function (){
  var linkkeys = Object.keys(CONST.INTROLOGO.DATA["Liens"]);
  var datalinks = [];
  // Réarrangement de l'objet des liens
  for (var i=0; i<linkkeys.length; i++){
    for (var j=0; j<CONST.INTROLOGO.DATA["Liens"][linkkeys[i]].length; j++){
      var obj = CONST.INTROLOGO.DATA["Liens"][linkkeys[i]][j];
      obj.type = linkkeys[i];
      datalinks.push(obj);
    }
  }
  // Création de l'index sur les id des noeuds
  CONST.INTROLOGO.DATA.indexor = {};
  for (var i=0; i<CONST.INTROLOGO.DATA["Noeuds"].length; i++){
    CONST.INTROLOGO.DATA.indexor[ CONST.INTROLOGO.DATA["Noeuds"][i].id ] = i;
  }
  return datalinks;
}

// Déssin de la figure
var drawfig = function (nodes, links){
  var $nodes = svg
    .selectAll('.node')
    .data(nodes)
  var $links = svg
    .selectAll('.link')
    .data(links)

  // Dessin des liens
  var linkenter = $links.enter()
    .insert("g", ":first-child")
    .classed("link", true)
    .attr("id", function (d){return "source"+d.source+"target"+d.target})
  linkenter.append("path")
    .classed('link-base', true)
    .attr("fill", colorlinkfiginit())
  linkenter.append("path")
    .classed('link-body', true)
    .attr("fill", colorlinkfiginit())
  // Dessin des noeuds
  var nodeenter = $nodes.enter()
    .insert("g", ":first-child")
    .classed("node", true)
    .attr("id", function (d){return "nodeintro"+d.id})
    .attr("transform", function (d){return "translate("+d.x+", "+d.y+")"})
  nodeenter.append("path")
    .classed('circle-membrane', true)
    .attr("fill", colorfiginit(0.3))
    .attr('d', function(d){
      return radialLine(d.points);
    });
  nodeenter.append("path")
    .classed('circle-kernel', true)
    .attr("fill", colorfiginit(1))
    .attr('d', function(d){
      return radialLine(d.kernelPoints);
    });
  nodeenter.append("text")
    .attr("dx", 0)
    .attr("dy", -10)
    .attr('text-anchor', "middle")
    .text(function (d){return d.nom})
}

var updatenodeposition = function (){
  d3.selectAll(".node")
    .attr("transform", function (d){return "translate("+d.x+", "+d.y+")"})
    .selectAll("text")
    .attr("dx", 0)
    .attr("dy", -10)
  var graphlinks = d3.selectAll(".link")
    .attr("transform", function (d){return "translate("+nodes[CONST.INTROLOGO.DATA.indexor[d.source]].x+", "+nodes[CONST.INTROLOGO.DATA.indexor[d.source]].y+")"})
  graphlinks.selectAll(".link-base")
    .attr('d', function (d){return radialLine(nodes[CONST.INTROLOGO.DATA.indexor[d.source]].kernelPoints);})
    .attr('transform', 'scale('+CONST.INTROLOGO.LINK_KERNEL_SCALE+')');
  graphlinks.selectAll(".link-body")
    .attr('d', function(d){
      d.body = d.body || CONST.LINK_DEFAULT_BODY;
      return areaPath(areaPoints(d));
    });
}

// Chargement de la simulation - force layout
var firsttick = true;
var configSimulation = function (simulation){
  simulation.nodes(nodes)
    .force("center", d3.forceCenter(CONST.VUE.WIDTH/2.4,CONST.VUE.HEIGHT/2.4))
    .force("collide", d3.forceCollide().radius(function (d){
        return 1.4*spendingScale(parseInt(d["Dépenses Lobby (€)"]));
      }))
      simulation.on("tick", function (){
        if (firsttick){
          drawfig(nodes, links)
          firsttick = false;
        } else {
          updatenodeposition();
        }
      });
}
