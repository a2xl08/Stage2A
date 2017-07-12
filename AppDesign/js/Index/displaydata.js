/* 

Attention, les fonctions utilisées dans ce script
sont prévues pour s'exécuter après chargement
total de la page et des données dans CONST.DATASET
(appel à d3.csv asynchrone)

Ces fonctions seront appelées dans le scroller
au cours du scroll utilisateur

NE DEFINIR QUE DES VARIABLES ET DES FONCTIONS
NE RIEN EXECUTER ICI

*/
var datafiltre;
// Tableau qui recence les choix utilisateurs
var choices = [];
// Pas vertical d'affichage du résultat
var pas = 45;

// Cette fonction ajuste la taille des disques en fonction de la donnée
function scalablesize (d){
  var max = tabnbloby[tabnbloby.length-1];
  return d/max+0.2
}

// Cette fonction est appelée pour positionner le texte
// Elle permet d'éviter les recoupements entre les dernières
// tranches de la pie. 
function coefeloign (d){
  if ((d.index>3) && (d.index!==piezeddata.length-1)){
    return 1.5 - 0.3*(d.index%2);
  } else {
    return 1.2;
  }
}

// Gestion du survol
// intselect correspond au numéro des cercles auxquels appliquer l'effet hoverize
function hoverize (intselect, alpha){
  var cercles = d3.selectAll("g.loby"+intselect+" path");
  if (alpha>=1){

    cercles.on("mouseover", function (d,i){
      var avirer = d3.selectAll("g.arc:not(.cercle"+i+").loby"+intselect);
      avirer.transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("opacity", 0.3)

      avirer.select("path")
        .transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("fill", "gray");
    })

    cercles.on("mouseout", function (d,i){
      var avirer = d3.selectAll("g.arc:not(.cercle"+i+").loby"+intselect);
      avirer.transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("opacity", 1)

      avirer.select("path")
        .transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("fill", function (d,j){
          if (j<i){
            return color(j);
          } else {
            return color(j+1);
          }
        });

    })

  } else {
    cercles.on("mouseover", function(){});
    cercles.on("mouseout", function(){});
  }
}

// On gère la couleur des #answers au choix utilisateur
function resetcolors (){
  d3.select("p.nom").style("color", "rgb(186, 186, 186)");
  d3.select("p.country").style("color", "rgb(186, 186, 186)");
  d3.select("p.secteur").style("color", "rgb(186, 186, 186)");
  d3.select("p.type").style("color", "rgb(186, 186, 186)");
  d3.select("p.theme").style("color", "rgb(186, 186, 186)");
  d3.select("p.position").style("color", "rgb(186, 186, 186)");
  d3.select("p.fonction").style("color", "rgb(186, 186, 186)");
}

// Animation du cercle cliqué
// Mémorisation du choix utilisateur
function circleonclick (intselect,i){
  // On vire les cercles non selectionnés
    var avirer = d3.selectAll("g.arc:not(.cercle"+i+"loby"+intselect+")")
    avirer.transition()
        .duration(CONST.TIMETRANSITION)
        .attr("transform", "translate("+(-2500)+", "+2500+")");

    // Traitement de l'élément cliqué
    var selected = d3.select("g.cercle"+i+"loby"+intselect);
    selected.transition()
        .duration(CONST.TIMETRANSITION)
        .attr("transform", "translate("+(0.5*CONST.VUE.WIDTH)+", "+(0.5*CONST.VUE.HEIGHT)+")")
    selected.select("path")
        .transition()
        .duration(CONST.TIMETRANSITION)
        .attr("d", arc.outerRadius(function (){
          return outerRadius;
        }))
    selected.select("text")
        .transition()
        .duration(CONST.TIMETRANSITION)
        .attr("transform", function (){
          var textpos = this.getBoundingClientRect();
          var string="translate(";
          string += (-textpos.right + textpos.left)/2;
          string += ", ";
          string += (-0.3*CONST.VUE.HEIGHT);
          string += ")";
          return string;
        })

    // Mémorisation du choix utilisateur
      var indice = Number(selected.attr("class")[10]);
      choices.push(themelist[indice]);
      nbloby = piedata[indice];
      console.log("nbloby = "+nbloby);
      tabnbloby.push(nbloby);
      console.log(tabnbloby);
}

// Fonction qui supprime les sections en trop
function removesections(intselect){
  d3.select("#section").selectAll("section").each(function (){
    var section = d3.select("this");
    var id = section.attr("id");
    var num = Number(id[3]);
    if (num>=6+intselect){
      section.remove();
      // On supprime l'entrée de l'ensemble des datafiltre
      CONST.ALLDATAFILTRE.splice(CONST.ALLDATAFILTRE.length-1,1);
      // On supprime les éléments graphiques associés à cette section
      CONST.QUEST.ARCS[CONST.QUEST.ARCS.length-1].remove();
      CONST.QUEST.ARCS.splice(CONST.QUEST.ARCS.length-1,1);
    }
  })
}

// Fonction qui crée les nouvelles sections
function createsection (){
  var section = d3.select("#sections")
                  .append("section")
                  .attr("id", "sec"+(currentIndex+1))
  section.append("h1");
  section.append("p").attr("class", "texte");
  section.append("p").attr("class", "appel");
  writeTextInSection(currentIndex+1);
}

// On charge des données : remplissage des variables graphiques utiles
function filterAndLoad (filter, value, nextissue, inttosee){
  CONST.ALLDATAFILTRE[inttosee]=[]
  // On filtre les données selon la position choisie
  for (var i=0; i<CONST.ALLDATAFILTRE[inttosee-1].length; i++){
    if (CONST.ALLDATAFILTRE[inttosee-1][i][filter]===value){
      CONST.ALLDATAFILTRE[inttosee].push(CONST.ALLDATAFILTRE[inttosee-1][i])
    } else {
      // On enlève
    }
  }

  // On génère le jeu de variables graphiques
  datafiltre=CONST.ALLDATAFILTRE[inttosee].slice();
  themelist=[];
  piedata=[];
  for (var i=0; i<datafiltre.length; i++){
    var donnee = datafiltre[i][nextissue]
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


// On charge les nouvelles données
function loadNewData (inttosee){
  if (nbloby===1){
    // On filtre les données pour ne garder que le résultat
    var nbchoix = choices.length;
    for (var i=0; i<datafiltre.length; i++){
      if (nbchoix>=2){
        if (datafiltre[i][choices[0]]!==choices[1]){
          datafiltre[i]=0
        }
      }
      if (nbchoix>=3){
        if (datafiltre[i]["Type"]!==choices[2]){
          datafiltre[i]=0
        }
      }
      if (nbchoix>=4){
        if (datafiltre[i]["Secteurs d’activité"]!==choices[3]){
          datafiltre[i]=0
        }
      }
      if (nbchoix>=5){
        if (datafiltre[i]["Pays/Région"]!==choices[4]){
          datafiltre[i]=0
        }
      }
      if (nbchoix>=6){
        if (datafiltre[i]["Nom1"]!==choices[5]){
          datafiltre[i]=0
        }
      }
    } 
    while (datafiltre.indexOf(0)!==-1){
      datafiltre.splice(datafiltre.indexOf(0), 1);
    }

    // nbloby=1, On génère le résultat dans generateResult

  } else 
  switch (inttosee) {
  case 1:
    /* Seul le thème a été choisi, 
    charger la position SUPPORTS/OPPOSES 
    du thème choisi */

          // On ne peux pas appeler filterAndLoad ici, on le fait manuellement 
    // On filtre les données selon le thème choisi
    CONST.ALLDATAFILTRE[inttosee]=[];
    for (var i=0; i<CONST.ALLDATAFILTRE[inttosee-1].length; i++){
      console.log(CONST.ALLDATAFILTRE[inttosee-1][i][choices[0]])
      if (CONST.ALLDATAFILTRE[inttosee-1][i][choices[0]]){
        CONST.ALLDATAFILTRE[inttosee].push(CONST.ALLDATAFILTRE[inttosee-1][i])
      } else {
        // On enlève
      }
    } 

    // On génère le jeu de variable pour les éléments graphiques
    datafiltre = CONST.ALLDATAFILTRE[inttosee].slice();
    piedata = [0,0]; // SUPPORTS, OPPOSES
    for (var i=0; i<datafiltre.length; i++){
      if (datafiltre[i][choices[0]]==="SUPPORT"){
        piedata[0]++;
      } else if (datafiltre[i][choices[0]]==="OPPOSE"){
        piedata[1]++;
      }
    }
    piezeddata = pie(piedata);
    themelist = ["SUPPORT", "OPPOSE"];
    break;

  case 2:
    /* L'utilisateur a choisi son thème
    ainsi que sa position par rapport à ce thème. 
    Charger maintenant la catégorie de lobbyist */

    filterAndLoad(choices[0], choices[1], "Type", inttosee);
    break;

  case 3:
    /* L'utilisateur a choisi son thème
    ainsi que sa position par rapport à ce thème. 
    Il vient de choisir le type de structure qui lui convient. 
    Charger maintenant le secteur de lobby */

    filterAndLoad("Type", choices[2], "Secteurs d’activité", inttosee);
    break;

  case 4:
    /* L'utilisateur a choisi son thème
    ainsi que sa position par rapport à ce thème. 
    Il a choisi le type de structure qui lui convient. 
    Il vient de choisir le secteur qui lui convient. 
    Charger maintenant le pays de lobby */

    filterAndLoad("Secteurs d’activité", choices[3], "Pays/Région", inttosee);
    break;

  case 5:
    /* L'utilisateur a choisi son thème,
    sa position par rapport à ce thème ainsi que 
    le type de structure qui lui convient et son secteur. 
    Il vient de choisir son pays de prédilection. 
    On prop */

    filterAndLoad("Pays/Région", choices[4], "Nom1", inttosee);
    break;

  } 
}

function generatePie (inttosee){
  console.log(piezeddata);
  arc = d3.arc()
                .innerRadius(0)
                .outerRadius(outerRadius);

  CONST.QUEST.ARCS[inttosee] = svg.selectAll("g.xxx")
          .data(piezeddata)
          .enter()
          .append("g")
          .attr("class", function (d,i){
            return "arc cercle"+i+" "+"loby"+inttosee+" cercle"+i+"loby"+inttosee;
          })
          .attr("transform", "translate("+(0.5*CONST.VUE.WIDTH)+", "+(0.5*CONST.VUE.HEIGHT)+")")
          .attr("opacity", 0);

  CONST.QUEST.ARCS[inttosee].append("path")
    .attr("d", arc)
    .attr("fill", function (d,i){
      return color(i);
    })

  CONST.QUEST.ARCS[inttosee].append("text")
    .text(function (d,i){ return themelist[i]+" ("+piezeddata[i].data+")" })
    .style("font-size", function (d){
      return 0.45*CONST.VUE.WIDTH/CONST.VUE.HEIGHT+"em"
    })
    .attr("transform", function (d,i) {
      var string = "translate(";
      var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
      var textpos = this.getBoundingClientRect();
                // attention position
      if ((angle>Math.PI) && (d.index>4) && (d.index===piezeddata.length-1)){
        string += (coefeloign(d) * outerRadius * Math.sin(angle));
      } else if (angle>Math.PI){
        string += (coefeloign(d) * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
      } else {
        string += (coefeloign(d) * outerRadius * Math.sin(angle));
      }
      string += ', ';
      string += (-coefeloign(d) * outerRadius * Math.cos(angle));
      string += ")";
      return string;
    })
}

// Gestion du choix utilisateur : click
function clickable (intselect,alpha){
  if (alpha>=1){
    var cercles = d3.selectAll("g.loby"+intselect+" path")
            .style("cursor", "pointer");
    cercles.on("click", function (d,i){
      // On supprime l'écoute de l'événement
      cercles.on("mouseover", function (){});
      cercles.on("mouseout", function (){});
      cercles.on("click", function (){});

      // On bouge les cercles
      circleonclick(intselect,i);

      // Affichage du choix utilisateur dans #answers
      var nbchoix = choices.length;

      switch (nbchoix){
        case 1:
          var element = d3.select("span.theme");
          element.text(choices[0]);
          resetcolors();
          d3.select("p.theme").style("color", colorlastanswer);
          d3.select("p.position").style("display", "block");
          break;
        case 2:
          var element = d3.select("span.position");
          element.text(choices[1]);
          resetcolors();
          d3.select("p.position").style("color", colorlastanswer);
          d3.select("p.type").style("display", "block");
          break;
        case 3:
          var element = d3.select("span.type");
          element.text(choices[2]);
          resetcolors();
          d3.select("p.type").style("color", colorlastanswer);
          d3.select("p.secteur").style("display", "block");
          break;
        case 4:
          var element = d3.select("span.secteur");
          element.text(choices[3]);
          resetcolors();
          d3.select("p.secteur").style("color", colorlastanswer);
          d3.select("p.country").style("display", "block");
          break;
        case 5:
          var element = d3.select("span.country");
          element.text(choices[4]);
          resetcolors();
          d3.select("p.country").style("color", colorlastanswer);
          d3.select("p.nom").style("display", "block");
          break;  
      } 

      // Suppression des sections inutiles
      removesections(intselect);

      // Création des nouvelles sections  
      createsection();

      // MAJ des coordonnées des sections
      majsectionspos();

      // On charge les données pour le choix suivant s'il y en a un
      loadNewData(intselect+1);
      if (nbloby===1){
        setlinkURL();
        //generateResult();
      } else {
        generatePie(intselect+1);
      }
    })
  } else {
    var cercles = d3.selectAll("path")
            .style("cursor", "default");
    cercles.on("click", function (){});
  }
}

function manageSec5 (pos){
  var startsection = sectionPositions[4];
  var alpha = (pos - startsection)/scrollheight;
  console.log(alpha)
  // Définir ici les alphasteps de la section 5
  var alphasteps = [0,0.6,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On s'assure que la fiche est invisible
    CONST.QUEST.D3.select("image").attr("y", CONST.VUE.HEIGHT);
    moveFiche(-deltay-deltay2);
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
    }) 
    CONST.BADGE.D3.select(".point")
          .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height)
    // Le point suit la fiche
  } else if (alpha<=alphasteps[1]){
    // On déplace la fiche
    var beta = abTo01(0,alphasteps[1],alpha);
    CONST.QUEST.D3.select("image").attr("y", (1-beta)*CONST.VUE.HEIGHT);
    moveFiche(-deltay-deltay2-beta*CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y-beta*CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
    }) 
    CONST.BADGE.D3.select(".point")
          .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height)
    // On rend invisible l'#answer p.theme
    d3.select("p.theme").style("display", "none");
    // On s'assure que les cercles sont invisibles
    CONST.QUEST.ARCS[0].attr("opacity", 0);
  } else if (alpha<=1){
    // On s'assure que la fiche est à sa place
    CONST.QUEST.D3.select("image").attr("y", 0);
    moveFiche(-deltay-deltay2-CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y-CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y"))-CONST.VUE.HEIGHT);
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y"))-CONST.VUE.HEIGHT)
    }) 
    CONST.BADGE.D3.select(".point")
          .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height-CONST.VUE.HEIGHT)
    // On rend visible les cercles de l'étape thème
    var beta = abTo01(alphasteps[1],1,alpha)
    CONST.QUEST.ARCS[0].attr("opacity", beta);
    // On rend visible l'#answers p.theme
    d3.select("p.theme").style("display", "block");
  } else {
    // On s'assure que les cercles sont bien visibles
    CONST.QUEST.ARCS[0].attr("opacity", 1);
  }
  // On rend les cercles cliquables si alpha>=1
  // On annule le clickable sinon
  hoverize(0,alpha);
  clickable(0,alpha);
}

// Transition d'opacité
function transitOpacity (old, newer, beta){
  old.attr("opacity", 1-beta);
  newer.attr("opacity", beta);
}

// Eclatement des pie
function pieSplash (intselect, beta){
  CONST.QUEST.ARCS[intselect]
        .attr("transform", function (d,i){
          var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
          if (angle>Math.PI){
            return "translate("+(0.5*CONST.VUE.WIDTH+beta*0.25*CONST.VUE.WIDTH*Math.sin(angle))+", "+(0.5*CONST.VUE.HEIGHT+(-beta*0.3*CONST.VUE.HEIGHT*Math.cos(angle)))+")"    
          } else {
            return "translate("+(0.5*CONST.VUE.WIDTH+beta*0.15*CONST.VUE.WIDTH*Math.sin(angle))+", "+(0.5*CONST.VUE.HEIGHT+(-beta*0.2*CONST.VUE.HEIGHT*Math.cos(angle)))+")"
          }   
        });
}

// Fermeture d'une part de pie en une nouvelle pie
function pieToCircles (cercles, textes, beta){
  cercles
        .attr("d", arc.endAngle(function (d){
          return d.endAngle + 2*Math.PI*beta;
        }))
        .attr("d", arc.outerRadius(function (d){
          return (1-0.2*beta*(1/scalablesize(d.data)))*outerRadius;
        }))
  textes
        .attr("transform", function (d,i) {
          var string = "translate(";
          var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
          var textpos = this.getBoundingClientRect();
                    // attention position                 // position initiale du dernier quart
          if ((angle>Math.PI) && (d.index>4) && (d.index===piezeddata.length-1) && (choices.length!==0)){
            string += ((coefeloign(d)-0.4*beta) * outerRadius * Math.sin(angle));
          } else if (angle>Math.PI){
            string += ((coefeloign(d)-0.4*beta) * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
          } else {
            string += ((coefeloign(d)-0.4*beta) * outerRadius * Math.sin(angle));
          }
          string += ', ';
          string += (-(coefeloign(d)-0.4*beta) * outerRadius * Math.cos(angle));
          string += ")";
          return string;
        })
}

// Gestion de la section .loby${intselect}
function manageSecX (intselect,pos){
  var startsection = sectionPositions[4+intselect];
  var alpha = (pos - startsection)/scrollheight;
  console.log(alpha)
  // Définir ici les alphasteps de la section 5
  var alphasteps = [0,0.2,0.6,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On s'assure que beta=0
    var old = d3.selectAll("g.loby"+(intselect-1));
    var newer = d3.selectAll("g.loby"+intselect);
    transitOpacity(old, newer, 0);
  } else if (alpha<=alphasteps[1]){
    // On gère la transparence en fonction du scroll
    var old = d3.selectAll("g.loby"+(intselect-1));
    var newer = d3.selectAll("g.loby"+intselect);
    var beta = abTo01(0,alphasteps[1],alpha);
    transitOpacity(old, newer, beta);
    // On s'assure que les parts sont positionnées en pie
    pieSplash(intselect,0);
  } else if (alpha<=alphasteps[2]){
    // On s'assure que les bons cercles sont visibles et les anciens invisibles
    var old = d3.selectAll("g.loby"+(intselect-1));
    var newer = d3.selectAll("g.loby"+intselect);
    transitOpacity(old,newer,1);
    // Position des parts
    var beta = abTo01(alphasteps[1],alphasteps[2],alpha);
    pieSplash(intselect, beta);
    // On s'assure que les parts ne sont pas éclatées
    var cercles = d3.selectAll("g.loby"+intselect+" path");
    var textes = d3.selectAll("g.loby"+intselect+" text");   
    pieToCircles(cercles, textes, 0);
  } else if (alpha<=1){
    // On s'assure les parts sont bien éclatées
    pieSplash(intselect,1);
    // On referme les parts
    var cercles = d3.selectAll("g.loby"+intselect+" path");
    var textes = d3.selectAll("g.loby"+intselect+" text");   
    var beta = abTo01(alphasteps[2],1,alpha);
    pieToCircles(cercles, textes, beta);
  } else {
    // On s'assure que les parts sont bien refermées mais on ne s'assure pas que le rayon est correct
    // car celui ci sera par clickable au moment du clic
    var cercles = d3.selectAll("g.loby"+intselect+" path");
    cercles
        .attr("d", arc.endAngle(function (d){
          return d.endAngle + 2*Math.PI;
        }))
  }
  // On rend ces cercles cliquables si alpha>=1
  // On annule le cliquable sinon
  hoverize(intselect,alpha);
  clickable(intselect,alpha);
}