var vue = document.getElementById("vue");
var vuepos = vue.getBoundingClientRect();
var height = vue.offsetHeight - 2 * 10; // 15 est le padding de #vue
var width = vue.offsetWidth - 2 * 10;

var carwidth;

var base = d3.select("#vue");
var canvas = base.append("canvas")
				.attr("class", "visible")
				.attr("width", width)
				.attr("height", height);

// Ce canvas caché nous aidera à identifier les
// éléments lors du clic : 1 elem = 1 couleur
var hidden = base.append("canvas")
				.attr("width", width)
				.attr("height", height)
				.style("display", "none");
var colToNode = {};

var ctx = canvas.node().getContext("2d");
var ctxhid = hidden.node().getContext("2d");

// Création d'un élément factice qui recevra nos faux noeuds
detachedContainer = document.createElement("custom")
var CustomDOM = d3.select(detachedContainer);

var scale = d3.scaleLinear().domain([0,100]).range([0,height/2]);

function clearCanvas(){
	// clear canvas
  ctx.save()
  ctx.translate(0,0);
  ctx.fillStyle = "white";
  ctx.rect(0,0,canvas.attr("width"),canvas.attr("height"));
  ctx.fill();
  ctx.restore();

  	// clear hidden canvas and reset colors associations
  ctxhid.save()
  ctxhid.translate(0,0);
  ctxhid.fillStyle = "white";
  ctxhid.rect(0,0,canvas.attr("width"),canvas.attr("height"));
  ctxhid.fill();
  ctxhid.restore();
  colToNode = {};
  nextCol = 0;
}

function drawcar(x,y){

	// Roue gauche
	ctx.save();
	ctx.translate(x+0.2*carwidth, y+(0.45)*carwidth);
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.arc(0,0,0.2*carwidth,0,2*Math.PI);
	ctx.closePath()
	ctx.fill()
	ctx.restore()

	// Roue droite
	ctx.save();
	ctx.translate(x+carwidth-0.3*carwidth, y+(0.45)*carwidth);
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.arc(0,0,0.2*carwidth,0,2*Math.PI);
	ctx.closePath()
	ctx.fill()
	ctx.restore()

	// Corps de la voiture
	ctx.save();
	ctx.translate(x,y);
	ctx.fillStyle = "red";
	ctx.fillRect(0,0,carwidth,0.5*carwidth);
	ctx.restore();

}

function reliefsDOMInsert(){

	// Mise à jour du faux DOM
	console.log(dataset);
	var dataBinding = CustomDOM.selectAll("custom.rect")
						.data(dataset)
						.enter()
						.append("custom")
						.attr("class", "rect reliefs")
						.attr("x", function (d,i){
							return (width/numreliefs)*i;
						})
						.attr("y", function (d,i){
							return (0.75*height) - scale(d);
						})
						.attr("width", width/numreliefs)
						.attr("height", function(d){
							return scale(d)
						})
						.attr("fillStyle", "brown");

}

function drawreliefs() {
	var elements = CustomDOM.selectAll("custom.rect.reliefs");
	elements.each(function (d){
		var node = d3.select(this);
		var newCol = genHiddenColor();

		ctx.save()
		ctx.translate(0,0)
		ctx.fillStyle = node.attr("fillStyle");
		ctx.fillRect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
		ctx.restore()

		ctxhid.save()
		ctxhid.translate(0,0)
		ctxhid.fillStyle = newCol;
		ctxhid.fillRect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
		ctxhid.restore()

		colToNode[newCol] = node;

	});
}

var nextCol=0;
function genHiddenColor(){
	var ret = [];
    // via http://stackoverflow.com/a/15804183
    if(nextCol < 16777215){
      ret.push(nextCol & 0xff); // R
      ret.push((nextCol & 0xff00) >> 8); // G 
      ret.push((nextCol & 0xff0000) >> 16); // B

      nextCol += 1;
    } else {
    	console.log("Stock de couleurs épuisé")
    	return "error"
    }
    var col = "rgb(" + ret.join(',') + ")";
    return col;
}