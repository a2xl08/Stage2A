var vue = document.getElementById("vue");
var height = vue.offsetHeight - 2 * 15; // 15 est le padding de #vue
var width = vue.offsetWidth - 2 * 15;
var svg = d3.select("#vue").append("svg").attr("width", width).attr("height", height);
var pie = d3.pie();
var dataset;
var nbthemes;
var themelist;
var datafiltre;
var piedata;
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

	var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(outerRadius);

	var arcs = svg.selectAll("g.arc")
					.data(pie(piedata))
					.enter()
					.append("g")
					.attr("class", "arc")
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

});