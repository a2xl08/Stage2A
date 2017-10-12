var radToDeg = function(rad){ return (rad*180)/Math.PI; };
var degToRad = function(deg){ return (deg*Math.PI)/180; };

var getNormalAngle = function(a,b){
  var angle = radToDeg(Math.atan2(b.y-a.y, b.x-a.x));
  return degToRad(angle - 90);
};

/*
 * Génère les points servant à dessiner l'aire du lien.
 * @param `points`
 *  tableau des points de la courbe, chaque point étant sous la forme suivante:
 *    {
 *      at:0.0, // pourcentage du placement du point sur la ligne entre `source` et `target`
 *      width: 5, // largeur de la bande à cet endroit.
 *      offset: -2 // distance par rapport à la ligne `source` <-> `target`
 *    }
 *    
 */
var areaPoints = function(link){
  link.body = link.body || CONSTANTS.LINK.DEFAULT_BODY;
  var points = link.body;
  var source = link.source; 
  var target = link.target; 
  var tgt = {
    x: target.x - source.x,
    y: target.y - source.y
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
  .curve(CONSTANTS.LINK.CURVE)
  .x0(function(pt){return pt.x0; })
  .x1(function(pt){return pt.x1; })
  .y0(function(pt){return pt.y0; })
  .y1(function(pt){return pt.y1; });

var linkBodyPath = function(link){
  var points = areaPoints(link);
  var path = areaPath(points);
  delete points;
  return path;
};

/*
 * Fonction responsable de changer les écarts des différents `points`
 * en fonction de la courbature passée.
 */
var changePointsCurbature = function(points, curbature){
  var newPoints = points.slice();
  var sign = Utils.sign(curbature);
  var curbatureLeft = Math.abs(curbature);
  
  for(var i = 0; i < newPoints.length; i++){
    var point = newPoints[i];
    if(i == (newPoints.length-1)){
      point.offset = curbatureLeft;
    } else {
      point.offset = sign * Utils.rand.number(-5, curbatureLeft);
      curbatureLeft -= point.offset;
    }
  }
  return newPoints;
};

var timers = {};

var linkReshapeInterval = null;
/*
 * Fonction responsable de la déformation d'un lien.
 * Tire au hasard une nouvelle courbature et modifie les écarts des points de la courbe (link.body)
 */
var reshapeLinks = function($links){
  var linkBodyTween = function(link){
    link.body = link.body || CONSTANTS.LINK.DEFAULT_BODY;

    var curbature = Utils.rand.sign() * Utils.rand.number(0, 15);
    var curbatureInterpolator = d3.interpolateNumber(link.curbature||0, curbature);
    var oldBody = link.body;
    var newBody = Utils.copy(oldBody);
    changePointsCurbature(newBody.slice(1,4), curbature);
    var bodyInterpolator = d3.interpolateArray(oldBody, newBody);
    return function(t){
      link.curbature = curbatureInterpolator(t);
      link.body = bodyInterpolator(t);
    }
  }
  $links.select('.link-body').each(function(link, i){
    var $link = d3.select(this);
    var delay = i * 20;
    function loop($link, delay, duration){
      $link.transition('linkReshape')
        .delay(delay)
        .ease(d3.easeLinear)
        .duration(duration)
        .tween('linkBody', linkBodyTween)
        .on('end', function(){
          loop($link, 0, duration);
        });
    }
    loop($link, delay, animations.linkShapes.duration);
  });
};

// arrête la déformation des liens.
var stopReshapeLinks = function($links){
  $links.interrupt();
};

// objet permettant de controler les animations depuis experimentations
var linkAnimations = {
  interval: linkReshapeInterval,
  start: reshapeLinks,
  stop: stopReshapeLinks
};

// 
var proprietaryOpacity = function(link){
  var value = link['Valeur (supp à%)'];
  var opacity = 0.15;
  if(value >= 50){
    opacity = 0.8;
  } else if(value >= 10){
    opacity = 0.4;
  }
  return opacity;

};

var linkOpacity = function(link){
  var NTYPES = CONSTANTS.DATA.TYPES.NODE;
  var TYPES = CONSTANTS.DATA.TYPES.LINK;
  var opacity;
  switch(link.type){
    case TYPES.AFFILIATION:
      opacity = CONSTANTS.LINK.AFFILIATION_OPACITY;
      break; 
    case TYPES.PROPRIETARY.DIRECT:
      opacity = proprietaryOpacity(link);
      break;
    case TYPES.PROPRIETARY.INDIRECT:
      opacity = 0.0;
      break;
    default: 
      opacity = CONSTANTS.LINK.AFFILIATION_OPACITY;
      break;
  }
  return opacity; 
};
var drawLinks = function(links){
  var canvas = scene.getCanvas();
  var $links = canvas.selectAll('.link').data(links, function(link){
    var key = link.data.source.ID + '-' + link.data.target.ID;
    return key;
  });
  var scale = CONSTANTS.LINK.KERNEL_SCALE;
  var TYPES = CONSTANTS.DATA.TYPES.LINK;
  var NTYPES = CONSTANTS.DATA.TYPES.NODE;
  
  var $linksEnter = $links.enter()
    .append('g')
    .attr('transform', function(link){ return Utils.transform(link.source); })
    .attr('class', function(link){
      return link.type.split('/').join('-') +' source-'+link.data.source.ID+' target-'+link.data.target.ID;
    })
    .style('opacity', linkOpacity)
    .classed('link', true)
    // permet de calculer uniquement le chemin des liens visible (pour les perfs)
    .classed('hidden', function(link){ return (link.data.source.type === NTYPES.PROPRIETARY && link.type === TYPES.PROPRIETARY.INDIRECT); });

  $linksEnter.append('path')
    .classed('link-base', true)
    .attr('d', (d)=>(radialLine(d.data.source.kernelPoints)))
    .attr('fill', Color.link)
    .attr('transform', 'scale('+scale+')'); 


  $linksEnter.append('path')
  .classed('link-body', true)
  .attr('fill', Color.link)
  .attr('d', function(link){
    link.body = link.body || CONSTANTS.LINK.DEFAULT_BODY;
    return areaPath(areaPoints(link));
  });
  var proprietaryLinks = $linksEnter
    .filter(function(link){ return (link.type === TYPES.PROPRIETARY.DIRECT || link.type === TYPES.PROPRIETARY.INDIRECT); });
  proprietaryLinks
    .select('.link-body').attr('fill-opacity', proprietaryOpacity);

  proprietaryLinks.select('.link-base').attr('fill-opacity', proprietaryOpacity);
      
    
  var $linksExit = $links.exit().remove();

  return {links: $links.merge($linksEnter), linksExit:$linksExit};
}
