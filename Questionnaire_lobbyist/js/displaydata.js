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
// Durée des transitions
var timetransition = 500;
// Tableau qui recence les choix utilisateurs
var choices = [];
// Associée aux sections dont les données sont traitées

function scrollAnimPie (pos){
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

// Gestion du choix utilisateur : click

function clickable (){
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
		var cercles = d3.selectAll("path")
						.style("cursor", "pointer");
		cercles.on("click", function (d,i){
			// On vire les cercles non selectionnés
			var avirer = d3.selectAll("g:not(.cercle"+i+")")
			avirer.transition()
					.duration(timetransition)
					.attr("transform", "translate("+(-2500)+", "+2500+")");

			// Traitement de l'élément cliqué
			var selected = d3.select("g.cercle"+i);
			selected.transition()
					.duration(timetransition)
					.attr("transform", "translate("+(0.5*width)+", "+(0.5*height)+")")
			selected.select("path")
					.transition()
					.duration(timetransition)
					.attr("d", arc.outerRadius(function (){
						return outerRadius;
					}))
			selected.select("text")
					.transition()
					.duration(timetransition)
					.attr("transform", function (){
						var textpos = this.getBoundingClientRect();
						var string="translate(";
						string += (-textpos.right + textpos.left)/2;
						string += ", ";
						string += (-0.3*height);
						string += ")";
						return string;
					})

			// Création des nouvelles sections	
			d3.select("#sections")
				.append("section")
				.attr("class", "datatransit")
				.append("p")
				.text(function (){
					return "Chargement de nouvelles données"
				})
			d3.select("#sections")
				.append("section")
				.attr("class", "newsection")
				.append("p")
				.text(function (){
					return "Ceci est un test"
				})

			// Mémorisation du choix utilisateur
			var indice = Number(selected.attr("class").slice(6));
			choices.push(themelist[indice]);
			nbloby = piedata[indice];
			console.log("nbloby = "+nbloby);

			// On charge les données pour le choix suivant
			loadNewData();

		})
	} else {
		var cercles = d3.selectAll("path")
						.style("cursor", "default");
		cercles.on("click", function (){});
	}
}

// On charge les nouvelles données
function loadNewData (){
	if (nbloby===1){
		console.log("FINI, afficher résultat")
	} else if (choices.length===1) {
		/* Seul le thème a été choisi, 
		charger la position SUPPORTS/OPPOSES 
		du thème choisi */

		// On filtre les données selon le thème choisi
		for (var i=0; i<datafiltre.length; i++){
			if (datafiltre[i][choices[0]]){
				//console.log("On garde !")
			} else {
				datafiltre[i]=0;
			}
		} 
		while (datafiltre.indexOf(0)!==-1){
			datafiltre.splice(datafiltre.indexOf(0), 1);
		}
	}
}

// Recherche de la position SUPPORTS/OPPOSES
function generatePie2 (){

}

function displayResult (){

}