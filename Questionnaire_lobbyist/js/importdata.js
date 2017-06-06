var vue = document.getElementById("vue");
var height = vue.offsetHeight - 2 * 15; // 15 est le padding de #vue
var width = vue.offsetWidth - 2 * 15;
var svg = d3.select("#vue").append("svg").attr("width", width).attr("height", height);
var pie = d3.pie();
var dataset;
var themelist;
var datafiltre;

d3.csv("data/Noeud_positions.csv", function(data){
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
	var nbthemes = themelist.length;
	var piedata = [];
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

});