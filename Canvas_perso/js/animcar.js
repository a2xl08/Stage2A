var starter = document.getElementById("starter");
var carindex = 0;

function carNextPos(index) {
	if (carindex<numreliefs-1){
		return [(index+1)*width/numreliefs, (0.75*height)-scale(dataset[index+1])-0.55*carwidth];
	} else {
		return [0, (0.75*height)-scale(dataset[0])-0.55*carwidth];
	}
	
}

function drawCanvas() {
	console.log("newcanvas")
	// Cette fonction itère le canvas et gère l'animation
	clearCanvas();
	drawreliefs();
	carwidth = Math.round(width/numreliefs);
	var newpos = carNextPos(carindex);
	carindex = (carindex + 1)%(numreliefs)
	drawcar(newpos[0], newpos[1]);
}

function startAnim (){
	starter.removeEventListener("click", startAnim);

	console.log("click")
	reliefsDOMInsert();
	d3.timer(drawCanvas)
}

var listen = starter.addEventListener("click", startAnim)