/* 

Attention, les fonctions utilisées dans ce script
sont prévues pour s'exécuter après chargement
total de la page et des données dans dataset
(appel à d3.csv asynchrone)

Ces fonctions seront appelées dans le scroller
au cours du scroll utilisateur

*/

// Largeur de la plage de scroll en pixels
var scrollheight = 500;

// Associée à la section indice 1

function scrollAnimTheme (pos){
	var startsection = sectionPositions[0];
	var alpha = (pos - startsection)/scrollheight;
	if ((alpha>=0) && (alpha<=1)){
		// Facilite les transitions en cas de scroll brutal
		if (alpha>=0.975){
			alpha=1;
		}
		if (alpha<=0.025){
			alpha=0;
		}
		if (alpha>=0.475 && alpha <=0.525){
			alpha=0.5
		}
		// Animations
		if (alpha<=0.5){
			arcs.transition()
				.duration(30)
				.attr("transform", function (d,i){
					var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
					if (angle>Math.PI){
						return "translate("+(0.5*width+2*alpha*0.2*width*Math.sin(angle))+", "+(0.5*height+(-2*alpha*0.2*height*Math.cos(angle)))+")"		
					} else {
						return "translate("+(0.5*width+2*alpha*0.125*width*Math.sin(angle))+", "+(0.5*height+(-2*alpha*0.125*height*Math.cos(angle)))+")"
					}
					
				});


		}
	}
}