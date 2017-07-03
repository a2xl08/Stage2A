/*

Ce script reçoit les fonctions qui permettent 
de représenter les données. 

Il s'agit notamment des fonctions 
qui dessinent le Canvas pour chacune des sections

Il y a aussi les fonctions qui gèrent l'échelle. 

Ces fonctions seront appelées dans des appels du type
simulation.on("tick", drawCanvasSec1)

Ces appels précédents seront effectués dans le script
scroller.js 
(appel de setupSecX() dans la fonction majvue
qui marque une séparation entre 2 sections)

*/

// Permet de lancer une portion de code uniquement
// au tick n°1
var firstick = 1;
var firstickAll = 1;

// Layout des secteurs
var w=Math.round(width/6);
var h=Math.round(height/6)
var centers = [
[w,h],   [2*w,h],   [3*w,h],   [4*w,h],   [5*w,h], 
[w,3*h], [2*w,3*h], [3*w,3*h], [4*w,3*h], [5*w,3*h], 
[w,5*h], [2*w,5*h], [3*w,5*h], [4*w,5*h], [5*w,5*h], 
];

// Layout des actionnaires
var h2 = height/12;
var pasx = 40;
var places = [];
for (var i=0; i<3; i++){
	for (var j=0; j<11; j++){
		places.push([(i+1)*pasx, (j+1)*h2])
	}
}

function defIDToIndex (){
	// On remplit l'annuaire
		// Dictionnaire inversé pour faciliter les liens
		// Il faut placer ce code ici à cause des appels asynchrones. 
		if (firstick){
			var NestedData = d3.nest()
							.key(function (d){return d.ID})
							.rollup(function (v){return v[0].index})
							.entries(dataset);
			IDToIndex = {};
			NestedData.forEach(function (d){
				console.log([d.key, d.value])
				IDToIndex[Number(d.key)] = d.value;
			})
			firstick=0;	
		}
}

function defallIDToIndex (){

	// Annuaire complet avec les actionnaires
	// Utile pour afficher les liens
	if (firstickAll){
		var NestedData = d3.nest()
							.key(function (d){return d.ID})
							.rollup(function (v){return v[0].index})
							.entries(allActors);
		allIDToIndex = {};
		NestedData.forEach(function (d){
			console.log([d.key, d.value])
			allIDToIndex[Number(d.key)] = d.value;
		})
		firstickAll=0;	
	}
}

var canvaspaddding=20;;
// Etant donné une sélection, cette fonction en remet
// les éléments graphiques
function boxforce (selection){
	var canvaspaddding = 20;
	selection.each(function (d){
		if (d.x < canvaspaddding){ d.x = canvaspaddding };
		if (d.y < canvaspaddding){ d.y = canvaspaddding };
		if (d.x > (width - canvaspaddding)){ d.x = width - canvaspaddding };
		if (d.y > (height - canvaspaddding)){ d.y = height - canvaspaddding }; 
	})
}

function tickedSec1 (){

		// Esapcement ! Recentrage !
		circlePos.each(function (d){
			if (d.key === "SUPPORT"){
				d.x += (width/3 - d.x)*simulation.alpha();
			} else {
				d.x += (2*width/3 - d.x)*simulation.alpha();
			}
			d.y += (height/2 - d.y)*simulation.alpha();
		})
		boxforce(circlePos); 


		drawCanvasSec1();

}

function drawCanvasSec1 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePos.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePos.each(function (d){
			var node = d3.select(this);

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec1 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPos)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + agregcoef(d)*scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					//.force("x", d3.forceX(width/2).strength(0.4))
					//.force("y", d3.forceY(height/2).strength(0.4));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec1);

}

function tickedSec2 (){

		// Esapcement ! Recentrage !
		circlePosType.each(function (d){
			if (d.key.split(",")[0] === "SUPPORT"){
				d.x += (width/3 - d.x)*simulation.alpha();
			} else {
				d.x += (2*width/3 - d.x)*simulation.alpha();
			}
			d.y += (height/2 - d.y)*simulation.alpha();
		})
		boxforce(circlePosType); 

		drawCanvasSec2();

}

function drawCanvasSec2 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePosType.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePosType.each(function (d){
			var node = d3.select(this);

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec2 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPosType)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 3*radius + agregcoef(d)*scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					//.force("x", d3.forceX(width/2).strength(0.4))
					//.force("y", d3.forceY(height/2).strength(0.4));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec2);

}

function tickedSec3 (){

		// Esapcement ! Recentrage !
		circlePosSecteur.each(function (d){
			if (d.key.split(",")[0] === "SUPPORT"){
				d.x += (width/3 - d.x)*simulation.alpha();
			} else {
				d.x += (2*width/3 - d.x)*simulation.alpha();
			}
			d.y += (height/2 - d.y)*simulation.alpha();
		})
		boxforce(circlePosSecteur);

		drawCanvasSec3();

}

function drawCanvasSec3 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePosSecteur.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePosSecteur.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec3 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPosSecteur)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + agregcoef(d)*scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					//.force("x", d3.forceX(width/2).strength(0.4))
					//.force("y", d3.forceY(height/2).strength(0.4));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec3);

}

function tickedSec4 (){

		// Esapcement ! Recentrage !
		circlePosSecteur.each(function (d){
			// L'indice du secteur dans la liste des secteurs
			// Cet indice permet de lepositionner sur centers[indice]
			var virgule = d.key.indexOf(",");
			var indice = secteurslist.indexOf(d.key.slice(virgule+1));
			d.x += ((centers[indice][0]-d.x) * simulation.alpha())
			d.y += ((centers[indice][1]-d.y) * simulation.alpha())
		})
		boxforce(circlePosSecteur);

		drawCanvasSec4();

}

function drawCanvasSec4 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePosSecteur.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePosSecteur.each(function (d){
			var node = d3.select(this);

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec4 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPosSecteur)
					//.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return radius + agregcoef(d)*scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					//.force("x", d3.forceX(width/2).strength(0.4))
					//.force("y", d3.forceY(height/2).strength(0.4));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec4);

}

function tickedSec5 (){

		// Esapcement ! Recentrage !
		circleSecteurPos.each(function (d){
			// L'indice du secteur dans la liste des secteurs
			// Cet indice permet de lepositionner sur centers[indice]
			var indice = secteurslist.indexOf(d.key);
			d.x += ((centers[indice][0]-d.x) * simulation.alpha())
			d.y += ((centers[indice][1]-d.y) * simulation.alpha())
		})
		boxforce(circleSecteurPos);

		drawCanvasSec5();

}

function drawCanvasSec5 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circleSecteurPos.each(function (d){
			// Affichage du halo
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fill();
		})

		// Traçage des cercles
		circleSecteurPos.each(function (d){
			var node = d3.select(this);

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec5 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataBySecteurPos)
					//.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					//.force("x", d3.forceX(width/2).strength(0.4))
					//.force("y", d3.forceY(height/2).strength(0.4));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec5);

}

function tickedSec6 (){

		// Esapcement ! Recentrage !
		defIDToIndex();
		circles.each(function (d){
			// L'indice du secteur dans la liste des secteurs
			// Cet indice permet de lepositionner sur centers[indice]
			var indice = secteurslist.indexOf(d["Secteurs d’activité"]);
			d.x += ((centers[indice][0]-d.x) * simulation.alpha())
			d.y += ((centers[indice][1]-d.y) * simulation.alpha())
		})
		boxforce(circles);

		drawCanvasSec6();

}

function drawCanvasSec6 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circles.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circles.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec6 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataset)
					//.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					//.force("x", d3.forceX(width/2).strength(0.4))
					//.force("y", d3.forceY(height/2).strength(0.4));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec6);

}

function tickedSec7 (){

		boxforce(circles);
		drawCanvasSec7();

}

function drawCanvasSec7 (){

		clearCanvas();

		// Traçage des liens
		ctx.strokeStyle = linkcolor;
		ctx.lineWidth = 1;
		affiliations.forEach(function (d){
			ctx.beginPath()
			var beginindex = IDToIndex[d.source.ID];
			var endindex = IDToIndex[d.target.ID];
			var x1 = Math.round(dataset[beginindex].x);
			var x2 = Math.round(dataset[endindex].x);
			var y1 = Math.round(dataset[beginindex].y);
			var y2 = Math.round(dataset[endindex].y);
			var xmid = 0.5*(x1+x2);
			var ymid = 0.5*(y1+y2);
			var dx = x2-x1;
			var dy = y2-y1;
			ctx.moveTo(x1, y1);
			ctx.quadraticCurveTo(xmid + curvecoef*dy, ymid - curvecoef*dx, x2, y2);
			ctx.stroke();
		});

		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circles.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circles.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, node.attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec7 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	// On renseigne les forces
	simulation = d3.forceSimulation().nodes(dataset)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("link", d3.forceLink(affiliations)
						.id(function (d){
							return d.ID;
						})
						.strength(function (d){
							return 0.4;
						})
					)
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + 2*scalablesizes(d["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.005))
					.force("y", d3.forceY(height/2).strength(0.005));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec7);

}

function tickedSec8 (){

		defallIDToIndex();

		/*circleActs.each(function (d){
			// Faire un layout des actionnaires
			var indice = idActlist.indexOf(d.ID)
			d.x += (places[indice][0] - d.x) * simulation.alpha();
			d.y += (places[indice][1] - d.y) * simulation.alpha();
		})*/
		boxforce(circles);
		boxforce(circleActs);
		
		drawCanvasSec8();

}

function drawCanvasSec8 (){

		clearCanvas();

		// Traçage des liens
		ctx.strokeStyle = linkcolor;
		ctx.lineWidth = 1;
		affiliations.forEach(function (d){
			ctx.beginPath()
			var beginindex = allIDToIndex[d.source.ID];
			var endindex = allIDToIndex[d.target.ID];
			var x1 = Math.round(allActors[beginindex].x);
			var x2 = Math.round(allActors[endindex].x);
			var y1 = Math.round(allActors[beginindex].y);
			var y2 = Math.round(allActors[endindex].y);
			var xmid = 0.5*(x1+x2);
			var ymid = 0.5*(y1+y2);
			var dx = x2-x1;
			var dy = y2-y1;
			ctx.moveTo(x1, y1);
			ctx.quadraticCurveTo(xmid + curvecoef*dy, ymid - curvecoef*dx, x2, y2);
			ctx.stroke();
		});

		// Traçage des liens actionnaires directs
		ctx.strokeStyle = linkactcolor;
		actionnairesDirect.forEach(function (d){
			ctx.save();
			ctx.globalAlpha = valToOpacity(d);
			ctx.beginPath();
			var beginindex = allIDToIndex[Number(d.source.ID)];
			var endindex = allIDToIndex[Number(d.target.ID)];
			var x1 = Math.round(allActors[beginindex].x);
			var x2 = Math.round(allActors[endindex].x);
			var y1 = Math.round(allActors[beginindex].y);
			var y2 = Math.round(allActors[endindex].y);
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.restore();
		})

		// Traçage des halos d'organisations
		// Le halo proportionnel aux dépenses
		circles.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles d'organisations
		circles.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, node.attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})

		// Traçage des cercles actionnaires
		circleActs.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
				// On doit définir le gradient radial de couleur
			var radgrad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, node.attr("r"));
			radgrad.addColorStop(0.1, actcolor);
			radgrad.addColorStop(1, backgroundcolor);
			ctx.fillStyle = radgrad;
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, node.attr("r"), 0, 2*Math.PI);
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, node.attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;
		})

}

function setupSec8 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	// On renseigne les forces
	simulation = d3.forceSimulation().nodes(allActors)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("link", d3.forceLink(affiliations)
						.id(function (d){
							return d.ID;
						})
						.strength(function (d){
							return 0.4;
						})
					)
					.force("link2", d3.forceLink(actionnairesDirect)
						.id(function (d){
							return d.ID;
						})
						.strength(function (d){
							return 0.1;
						})
					)
					.force("link3", d3.forceLink(actionnairesIndirect)
						.id(function (d){
							return d.ID;
						})
						.strength(function (d){
							return 0.1;
						})
					)
					.force("collide", d3.forceCollide().radius(function (d){
						if (d.hasOwnProperty("Lobby ID")){
							return 2*radius + 2*scalablesizes(d["Dépenses Lobby (€)"]);
						} else {
							return 1.5*numlinkradius(d);
						}
						
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.005))
					.force("y", d3.forceY(height/2).strength(0.005));

	//simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec8);

}