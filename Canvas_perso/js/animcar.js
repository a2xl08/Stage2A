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
	// Cette fonction itère le canvas et gère l'animation
	clearCanvas();
	drawreliefs();
	carwidth = Math.round(width/numreliefs);
	var newpos = carNextPos(carindex);
	carindex = (carindex + 1)%(numreliefs)
	drawcar(Math.round(newpos[0]), Math.round(newpos[1]));

	window.requestAnimationFrame(drawCanvas);
}

function startAnim (){
	starter.removeEventListener("click", startAnim);

	reliefsDOMInsert();
	window.requestAnimationFrame(drawCanvas);
}

starter.addEventListener("click", startAnim);

var moncanvas = document.querySelector(".visible")
moncanvas.addEventListener("click", function (e){

	// On repère les coordonnées du clic
	var mouseX = e.layerX;
	var mouseY = e.layerY;
	console.log([mouseX, mouseY]);

	// On obtient la couleur du pixel puis le noeud
	var col = ctxhid.getImageData(mouseX, mouseY, 1, 1).data;
	var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";
	console.log(colString)
	var node = colToNode[colString];
	console.log(node)

	if (node){
		node.attr("fillStyle", "blue")
	}

})