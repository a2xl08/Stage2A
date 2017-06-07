var vue = document.getElementById("vue");
var vuepos = vue.getBoundingClientRect();
var height = vue.offsetHeight - 2 * 15; // 15 est le padding de #vue
var width = vue.offsetWidth - 2 * 15;
var svg = d3.select("#vue").append("svg").attr("width", width).attr("height", height);
var pie = d3.pie();
var dataset;
var nbthemes;
var themelist;
var datafiltre;
var piedata;
var piezeddata;
var outerRadius = width/10;

d3.csv("data/Noeud_positions.csv", function (data){
	dataset=data;

	// Faire ici l'initialisation de la vue
	// Renseigner les fonctions modifiant la vue en dehors

	// On cherche la liste des thèmes
	themelist = Object.keys(data[0]);
	themelist.splice(themelist.indexOf("ConsultationOrganizationId"), 1);
	themelist.splice(themelist.indexOf("ConsultationOrganizationName"), 1);
	themelist.splice(themelist.indexOf("CommonName"), 1);
	themelist.splice(themelist.indexOf("Country"), 1);
	themelist.splice(themelist.indexOf("Type"), 1);
	themelist.splice(themelist.indexOf("Website"), 1);
	themelist.splice(themelist.indexOf("Secteur"), 1);
	themelist.splice(themelist.indexOf("Operating revenue (Turnover) th USD 2014"), 1);
	themelist.splice(themelist.indexOf("estimated cost"), 1);
	themelist.splice(themelist.indexOf("nb lobbyists"), 1);
	themelist.splice(themelist.indexOf("Logo"), 1);
	console.log(themelist);
	
	// On cherche le nombre d'acteurs qui se sont prononcés sur chaque thème
	nbthemes = themelist.length;
	piedata = [];
	for (var i=0; i<nbthemes; i++){
		var somme = 0;
		for (var j=0; j<data.length; j++){
			// Utilisation du truthy falsy
			if (data[j][themelist[i]]){
				somme++;
			}
		}
		piedata[i] = somme;
	}
	console.log(piedata);

	piezeddata = pie(piedata);

	console.log(piezeddata);

	// Les parts de cammenbert sont des arcs d'innerRadius 0
	var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(outerRadius);

	var arcs = svg.selectAll("g.arc")
					.data(piezeddata)
					.enter()
					.append("g")
					.attr("class", "arc")
					.attr("id", function (d,i){
						return "theme"+i;
					})
					.attr("transform", "translate("+(0.5*width)+", "+(0.5*height)+")");

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
		.text(function (d,i){ return themelist[i]+" ("+piezeddata[i].data+"% de réponses)" })
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
			string += (-1.5 * outerRadius * Math.cos(angle));
			string += ")";
			return string;
		})

});