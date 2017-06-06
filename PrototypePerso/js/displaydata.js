var vue = document.getElementById("vue");
var height = vue.offsetHeight - 2 * 15; // 15 est le padding de #vue
var width = vue.offsetWidth - 2 * 15;
var svg = d3.select("#vue").append("svg").attr("width", width).attr("height", height);
var barpadding = 4;
var arr1;
var arr2;
var arr3;

d3.csv("data/speedfinal.csv", function(data){
	axe1 = data[0];
	axe2 = data[1];
	axe3 = data[2];

	arr1 = Object.keys(axe1).map(function (key) { return axe1[key]; });
	arr2 = Object.keys(axe2).map(function (key) { return axe2[key]; });
	arr3 = Object.keys(axe3).map(function (key) { return axe3[key]; });

	// Barres de l'axe 1
	rects1 = svg.selectAll("rect.axe1")
		.data(arr1)
		.enter()
		.append("rect")
		.attr("class", "axe1");

	rects1.attr("width", width / arr1.length - barpadding)
		.attr("x", function (d,i){
			return 1+i*(width / arr1.length);
		})
		.attr("y", function (d){
			return 0.75 * height - Math.round(3*d);
		})
		.attr("height", function (d){
			return Math.round(3*d);
		})
		.attr("opacity", 0);

	// Barres de l'axe 2
	rects2 = svg.selectAll("rect.axe2")
		.data(arr2)
		.enter()
		.append("rect")
		.attr("class", "axe2");

	rects2.attr("width", width / arr2.length - barpadding)
		.attr("x", function (d,i){
			return 1+i*(width / arr2.length);
		})
		.attr("y", function (d){
			return 0.75 * height - Math.round(3*d);
		})
		.attr("height", function (d){
			return Math.round(3*d);
		})
		.attr("opacity", 0);

	// Barres de l'axe 3
	rects3 = svg.selectAll("rect.axe3")
		.data(arr3)
		.enter()
		.append("rect")
		.attr("class", "axe3");

	rects3.attr("width", width / arr3.length - barpadding)
		.attr("x", function (d,i){
			return 1+i*(width / arr3.length);
		})
		.attr("y", function (d){
			return 0.75 * height - Math.round(3*d);
		})
		.attr("height", function (d){
			return Math.round(3*d);
		})
		.attr("opacity", 0);

	// Etiquettes axe 1
	svg.selectAll("text.axe1")
		.data(arr1)
		.enter()
		.append("text")
		.attr("class", "axe1")
		.text(function (d){
			return Math.round(d);
		})
		.attr("x", function (d, i){
			return 1+(i+0.5)*(width / arr1.length);
		})
		.attr("y", function (d){
			return 20 + 0.75 * height - Math.round(3*d)
		})
		.attr("text-anchor", "middle")
		.attr("opacity", 0);

	// Etiquettes axe 2
	svg.selectAll("text.axe2")
		.data(arr2)
		.enter()
		.append("text")
		.attr("class", "axe2")
		.text(function (d){
			return Math.round(d);
		})
		.attr("x", function (d, i){
			return 1+(i+0.5)*(width / arr2.length);
		})
		.attr("y", function (d){
			return 20 + 0.75 * height - Math.round(3*d)
		})
		.attr("text-anchor", "middle")
		.attr("opacity", 0);

	// Etiquettes axe 3
	svg.selectAll("text.axe3")
		.data(arr3)
		.enter()
		.append("text")
		.attr("class", "axe3")
		.text(function (d){
			return Math.round(d);
		})
		.attr("x", function (d, i){
			return 1+(i+0.5)*(width / arr3.length);
		})
		.attr("y", function (d){
			return 20 + 0.75 * height - Math.round(3*d)
		})
		.attr("text-anchor", "middle")
		.attr("opacity", 0);

	// Titre du graphique
	svg.append("text")
		.attr("class", "graphtitle")
		.attr("x", 10+1.5*(width / arr1.length) + "px")
		.attr("y", 0.75 * height + 30 + "px")
		.text("Vitesse sur l'axe en km/h");

});

// On utilise des variations de transparence pour afficher les éléments
function displayaxe1(){
	svg.selectAll(".axe2")
		.transition()
		.duration(1000)
		.style("opacity", 0);
	svg.selectAll(".axe3")
		.transition()
		.duration(1000)
		.style("opacity", 0);
}

function displayaxe2(){
	svg.selectAll(".axe1")
		.transition()
		.duration(1000)
		.style("opacity", 0);	
	svg.selectAll(".axe3")
		.transition()
		.duration(1000)
		.style("opacity", 0);
}

function displayaxe3(){
	svg.selectAll(".axe1")
		.transition()
		.duration(1000)
		.style("opacity", 0);
	svg.selectAll(".axe2")
		.transition()
		.duration(1000)
		.style("opacity", 0);
}

var displayers = [displayaxe1, displayaxe2, displayaxe3];

function displayactualize(){
	displayers[currentIndex]();
	svg.selectAll("rect.axe"+(currentIndex+1))
		.attr("y", function (d){
			return 0.75 * height;
		})
		.attr("height", function (d){
			return 0;
		});
	svg.selectAll("text.axe"+(currentIndex+1))
		.transition()
		.delay(0)
		.style("opacity", 0);
}

// Permet d'afficher l'axe 1 dès le chargement de la page. 
document.addEventListener("DOMContentLoaded", displayactualize);

// La plage de scroll sur laquelle on gère la taille des barres
var scrollheight = 300;

function scrollsizes(index, pos){
	var startsection = sectionPositions[index];
	var alpha = (pos - startsection)/scrollheight;
	if ((alpha>=0) && (alpha<=1)){
		if (alpha>=0.95){
			alpha=1;
		}
		if (alpha<=0.05){
			alpha=0;
		}
		svg.selectAll("rect.axe"+(index+1))
			.transition()
			.duration(30)
			.attr("y", function (d){
				return 0.75 * height - Math.round(alpha*3*d);
			})
			.attr("height", function (d){
				return Math.round(alpha*3*d);
			})
			.style("opacity", 1);
		svg.selectAll("text.axe"+(index+1))
			.transition()
			.duration(30)
			.style("opacity", alpha);
	}
};