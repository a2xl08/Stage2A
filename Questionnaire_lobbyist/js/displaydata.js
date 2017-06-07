/* 

Attention, les fonctions utilisées dans ce script
sont prévues pour s'exécuter après chargement
total de la page et des données dans dataset
(appel à d3.csv asynchrone)

Ces fonctions seront appelées dans le scroller
au cours du scroll utilisateur

NE DEFINIR QUE DES VARIABLES ET DES FONCTIONS
NE RIEN EXECUTER ICI

*/

// Largeur de la plage de scroll en pixels
var scrollheight = 900;

// Associée à la section indice 1

function scrollAnimTheme (pos){
	var startsection = sectionPositions[0];
	var alpha = (pos - startsection)/scrollheight;
	var cercles = d3.selectAll("path")
	var textes = d3.selectAll("text")
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

			cercles.transition()
					.duration(30)
					.attr("d", arc.endAngle(function (d){
						return d.endAngle;
					}))
		} else {
			cercles.transition()
				.duration(30)
				.attr("d", arc.endAngle(function (d){
					return d.endAngle + 2*Math.PI*(2*alpha-1);
				}))
				.attr("d", arc.outerRadius(function (){
					return (1-0.5*(2*alpha-1))*outerRadius;
				}))
			textes.transition()
				.duration(30)
				.attr("transform", function (d,i) {
					var string = "translate(";
					var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
					var textpos = this.getBoundingClientRect();
					if (angle>Math.PI){
						string += ((1.2 - 0.5*(2*alpha-1)) * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
					} else {
						string += ((1.2 - 0.5*(2*alpha-1)) * outerRadius * Math.sin(angle));
					}
					string += ', ';
					string += (-(1.2 - 0.5*(2*alpha-1)) * outerRadius * Math.cos(angle));
					string += ")";
					return string;
				})
		}
	}
}

function clickable (){
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
		var cercles = d3.selectAll("path")
						.style("cursor", "pointer");
		cercles.on("click", function (d,i){
			console.log("click");
			var avirer = d3.selectAll("g:not(.cercle"+i+")")
			avirer.transition()
					.duration(500)
					.attr("transform", "translate("+(-2500)+", "+2500+")")
		})
	}
}