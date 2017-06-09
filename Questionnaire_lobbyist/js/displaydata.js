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
var scrollheight = 850;
// Durée des transitions
var timetransition = 500;
// Tableau qui recence les choix utilisateurs
var choices = [];

// Associée aux sections dont les données sont traitées

function scrollAnimPie (index, pos){
	var startsection = sectionPositions[index-1];
	var alpha = (pos - startsection)/scrollheight;
	var cercles = d3.selectAll("g.loby"+nbloby+" path")
	var textes = d3.selectAll("g.loby"+nbloby+" text")
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
						return "translate("+(0.5*width+2*alpha*0.3*width*Math.sin(angle))+", "+(0.5*height+(-2*alpha*0.3*height*Math.cos(angle)))+")"		
					} else {
						return "translate("+(0.5*width+2*alpha*0.2*width*Math.sin(angle))+", "+(0.5*height+(-2*alpha*0.2*height*Math.cos(angle)))+")"
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

// Associée aux sections de transition

function scrollTransitPie (index, pos){
	var startsection = sectionPositions[index-1];
	var alpha = (pos - startsection)/scrollheight;
	if ((alpha>=0) && (alpha<=1)){
		// Facilite les transitions en cas de scroll brutal
		if (alpha>=0.9){
			alpha=1;
		}
		if (alpha<=0.1){
			alpha=0;
		}
		// Animations
		var old = d3.selectAll("g.loby"+tabnbloby[tabnbloby.length-2]);
		var newer = d3.selectAll("g.loby"+tabnbloby[tabnbloby.length-1]);
		old.transition()
			.duration(30)
			.attr("opacity", 1-alpha);
		newer.transition()
			.duration(30)
			.attr("opacity", alpha);
	}
}

// Gestion du choix utilisateur : click

function clickable (){
	if ((window.innerHeight + window.scrollY) + 15 >= document.body.offsetHeight){
		var cercles = d3.selectAll("g.loby"+nbloby+" path")
						.style("cursor", "pointer");
		cercles.on("click", function (d,i){
			// On supprime l'écoute de l'événement
			//cercles.on("click", function (){});

			// On vire les cercles non selectionnés
			console.log("g:not(.cercle"+i+"loby"+nbloby+")")
			var avirer = d3.selectAll("g:not(.cercle"+i+"loby"+nbloby+")")
			avirer.transition()
					.duration(timetransition)
					.attr("transform", "translate("+(-2500)+", "+2500+")");

			// Traitement de l'élément cliqué
			var selected = d3.select("g.cercle"+i+"loby"+nbloby);
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

			// Mémorisation du choix utilisateur
			var indice = Number(selected.attr("class")[6]);
			choices.push(themelist[indice]);
			nbloby = piedata[indice];
			console.log("nbloby = "+nbloby);
			tabnbloby.push(nbloby);
			console.log(tabnbloby);

			// Création des nouvelles sections	
			d3.select("#sections")
				.append("section")
				.attr("class", "datatransit")
				.append("p")
				.text(function (){
					return "Chargement de nouvelles données"
				})
			// Si nbloby = 1, une section suffit pour afficher le résultat
			if (nbloby!==1){
				d3.select("#sections")
					.append("section")
					.attr("class", "newsection")
					.append("p")
					.text(function (){
						return "Ceci est un test"
					})
			}

			// MAJ des coordonnées des sections
			majsectionspos();

			// On charge les données pour le choix suivant
			loadNewData();
			generatePie();

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
		// On filtre les données pour ne garder que le résultat
		var nbchoix = choices.length;
		for (var i=0; i<datafiltre.length; i++){
			if (nbchoix>=1){
				if (datafiltre[i][choices[0]]!==choices[1]){
					datafiltre[i]=0
				}
			}
			if (nbchoix>=2){
				if (datafiltre[i]["Type"]!==choices[2]){
					datafiltre[i]=0
				}
			}
			if (nbchoix>=3){
				if (datafiltre[i]["Country"]!==choices[3]){
					datafiltre[i]=0
				}
			}
			if (nbchoix>=4){
				if (datafiltre[i]["ConsultationOrganizationName"]!==choices[4]){
					datafiltre[i]=0
				}
			}
		} 
		while (datafiltre.indexOf(0)!==-1){
			datafiltre.splice(datafiltre.indexOf(0), 1);
		}

		// nbloby=1, pas besoin de variables graphiques

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

		// On génère le jeu de variable pour les éléments graphiques
		piedata = [0,0]; // SUPPORTS, OPPOSES
		for (var i=0; i<datafiltre.length; i++){
			if (datafiltre[i][choices[0]]==="SUPPORTS"){
				piedata[0]++;
			} else if (datafiltre[i][choices[0]]==="OPPOSES"){
				piedata[1]++;
			}
		}
		piezeddata = pie(piedata);
		themelist = ["SUPPORTS", "OPPOSES"];
	} else if (choices.length===2) {
		/* L'utilisateur a choisi son thème
		ainsi que sa position par rapport à ce thème. 
		Charger maintenant la catégorie de lobbyist */

		// On filtre les données selon la position choisie
		for (var i=0; i<datafiltre.length; i++){
			if (datafiltre[i][choices[0]]===choices[1]){
				//console.log("On garde !")
			} else {
				datafiltre[i]=0;
			}
		} 
		while (datafiltre.indexOf(0)!==-1){
			datafiltre.splice(datafiltre.indexOf(0), 1);
		}

		// On génère le jeu de variables graphiques
		themelist=[];
		piedata=[];
		for (var i=0; i<datafiltre.length; i++){
			var donnee = datafiltre[i]["Type"]
			var indice = themelist.indexOf(donnee);
			if (indice===-1){
				themelist.push(donnee);
				piedata.push(1);
			} else {
				piedata[indice]++;
			}
		}
		piezeddata = pie(piedata);
	} else if (choices.length===3) {
		/* L'utilisateur a choisi son thème
		ainsi que sa position par rapport à ce thème. 
		Il vient de choisir le type de structure qui lui convient. 
		Charger maintenant le secteur de lobby */

		// On filtre les données selon le type choisi
		for (var i=0; i<datafiltre.length; i++){
			if (datafiltre[i]["Type"]===choices[2]){
				//console.log("On garde !")
			} else {
				datafiltre[i]=0;
			}
		} 
		while (datafiltre.indexOf(0)!==-1){
			datafiltre.splice(datafiltre.indexOf(0), 1);
		}

		// On génère le jeu de variables graphiques
		themelist=[];
		piedata=[];
		for (var i=0; i<datafiltre.length; i++){
			var donnee = datafiltre[i]["Secteur"]
			var indice = themelist.indexOf(donnee);
			if (indice===-1){
				themelist.push(donnee);
				piedata.push(1);
			} else {
				piedata[indice]++;
			}
		}
		piezeddata = pie(piedata);
	} else if (choices.length===4) {
		/* L'utilisateur a choisi son thème
		ainsi que sa position par rapport à ce thème. 
		Il a choisi le type de structure qui lui convient. 
		Il vient de choisir le secteur qui lui convient. 
		Charger maintenant le pays de lobby */

		// On filtre les données selon le secteur choisi
		for (var i=0; i<datafiltre.length; i++){
			if (datafiltre[i]["Secteur"]===choices[3]){
				//console.log("On garde !")
			} else {
				datafiltre[i]=0;
			}
		} 
		while (datafiltre.indexOf(0)!==-1){
			datafiltre.splice(datafiltre.indexOf(0), 1);
		}

		// On génère le jeu de variables graphiques
		themelist=[];
		piedata=[];
		for (var i=0; i<datafiltre.length; i++){
			var donnee = datafiltre[i]["Country"]
			var indice = themelist.indexOf(donnee);
			if (indice===-1){
				themelist.push(donnee);
				piedata.push(1);
			} else {
				piedata[indice]++;
			}
		}
		piezeddata = pie(piedata);
	} else if (choices.length===5) {
		/* L'utilisateur a choisi son thème,
		sa position par rapport à ce thème ainsi que 
		le type de structure qui lui convient et son secteur. 
		Il vient de choisir son pays de prédilection. 
		On prop */

		// On filtre les données selon le type choisi
		for (var i=0; i<datafiltre.length; i++){
			if (datafiltre[i]["Country"]===choices[4]){
				//console.log("On garde !")
			} else {
				datafiltre[i]=0;
			}
		} 
		while (datafiltre.indexOf(0)!==-1){
			datafiltre.splice(datafiltre.indexOf(0), 1);
		}

		// On génère le jeu de variables graphiques
		themelist=[];
		piedata=[];
		for (var i=0; i<datafiltre.length; i++){
			var donnee = datafiltre[i]["ConsultationOrganizationName"]
			console.log(donnee)
			var indice = themelist.indexOf(donnee);
			if (indice===-1){
				themelist.push(donnee);
				piedata.push(1);
			} else {
				piedata[indice]++;
			}
		}
		piezeddata = pie(piedata);
	}
}

// Affichage d'une nouvelle pie à partir de themelist et piezeddata
function generatePie (){
	arc = d3.arc()
                .innerRadius(0)
                .outerRadius(outerRadius);

	arcs = svg.selectAll("g.xxx")
					.data(piezeddata)
					.enter()
					.append("g")
					.attr("class", "arc")
					.attr("class", function (d,i){
						return "cercle"+i+" "+"loby"+nbloby+" cercle"+i+"loby"+nbloby;
					})
					.attr("transform", "translate("+(0.5*width)+", "+(0.5*height)+")")
					.attr("opacity", 0);

	arcs.append("path")
		.attr("d", arc)
		.attr("fill", function (d,i){
			if (i===0){
				return "rgb(39, 107, 216)"
			} else if (i===1) {
				return "rgb(173, 96, 29)"
			} else if (i===2) {
				return "rgb(28, 173, 45)"
			} else if (i===3) {
				return "rgb(237, 28, 28)"
			} 
			return "black";
		})

	arcs.append("text")
		.text(function (d,i){ return themelist[i]+" ("+piezeddata[i].data+")" })
		.style("font-size", 0.6*width/height+"em")
		.attr("transform", function (d,i) {
			var string = "translate(";
			var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
			var textpos = this.getBoundingClientRect();
			if (angle>Math.PI){
				string += (1.2 * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
			} else {
				string += (1.2 * outerRadius * Math.sin(angle));
			}
			string += ', ';
			string += (-1.2 * outerRadius * Math.cos(angle));
			string += ")";
			return string;
		})
}

function displayResult (pos){
	
}