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
var resultindex;

// Cette fonction ajuste la taille des disques en fonction de la donnée
function scalablesize (intselect,d){
  var max = tabnbloby[intselect];
  return d/max+0.2
}

// Cette fonction est appelée pour positionner le texte
// Elle permet d'éviter les recoupements entre les dernières
// tranches de la pie. 
function coefeloign (intselect, d){
  if ((d.index>3) && (d.index!==CONST.ALLPIEZEDDATA[intselect].length-1)){
    return 1.5 - 0.3*(d.index%2);
  } else {
    return 1.2;
  }
}

CONST.HOVERTEXT = {};
CONST.HOVERTEXT.singulier = [];
CONST.HOVERTEXT.singulier[0] = "organisation a pris position sur ce sujet";
CONST.HOVERTEXT.singulier[1] = "organisation a pris cette position sur le sujet sélectionné";
CONST.HOVERTEXT.singulier[2] = "organisation qui a la même position que vous sur le sujet sélectionné est de ce type";
CONST.HOVERTEXT.singulier[3] = "organisation qui est de même type et a la même position que vous provient de ce secteur d'activité";
CONST.HOVERTEXT.singulier[4] = "organisation qui est du même secteur, même type et même position que vous provient de cette région";
CONST.HOVERTEXT.pluriel = [];
CONST.HOVERTEXT.pluriel[0] = "organisations ont pris position sur ce sujet";
CONST.HOVERTEXT.pluriel[1] = "organisations ont pris cette position sur le sujet sélectionné";
CONST.HOVERTEXT.pluriel[2] = "organisations qui ont la même position que vous sur le sujet sélectionné sont de ce type";
CONST.HOVERTEXT.pluriel[3] = "organisations qui sont de même type et ont la même position que vous proviennent de ce secteur d'activité";
CONST.HOVERTEXT.pluriel[4] = "organisations qui sont du même secteur, même type et même position que vous proviennent de cette région";
CONST.HOVERTEXT.width = 120;
CONST.HOVERTEXT.height = 80;
function createHoverText(intselect,d,i,x,y){
  // Condition 1 pour ne pas avoir de cartouche à la section des noms
  // Condition 2 pour éviter des affichages de cartouches parasites
  if (intselect<5 && intselect===currentIndex-5){
  var foreign = svg.append("foreignObject")
      .attr("class", "cartouche")
      .attr("width", CONST.HOVERTEXT.width)
      .attr("height", CONST.HOVERTEXT.height)
      .attr("x", x)
      .attr("y", y)
      .attr("opacity",0)
  if (CONST.ALLPIEZEDDATA[intselect][i].data===1){
    foreign.html("<h1>"+ CONST.ALLPIEZEDDATA[intselect][i].data +"</h1><p>"+ CONST.HOVERTEXT.singulier[intselect] +"</p>");
  } else {
    foreign.html("<h1>"+ CONST.ALLPIEZEDDATA[intselect][i].data +"</h1><p>"+ CONST.HOVERTEXT.pluriel[intselect] +"</p>");
  }
  foreign.transition().duration(0.5*CONST.TIMETRANSITION).attr("opacity", 1);
  }
}

function removeHoverText(){
  d3.selectAll("foreignObject.cartouche").transition().duration(CONST.TIMETRANSITION).attr("opacity", 0);
  d3.selectAll("foreignObject.cartouche").remove()
  //setTimeout(function(){d3.selectAll("foreignObject").remove()}, 0.51*CONST.TIMETRANSITION);
}

// Gestion du survol
// intselect correspond au numéro des cercles auxquels appliquer l'effet hoverize
function hoverize (intselect, alpha){
  var cercles = d3.selectAll("g.loby"+intselect+" path");
  // On s'assure que les autres éléments n'ont pas d'hoverize
  d3.selectAll("g.arc").on("mouseover", function(){});
  d3.selectAll("g.arc").on("mouseout", function(){});
  if (alpha>=1){

    cercles.on("mouseover", function (d,i){
      var selected = d3.select("g.cercle"+i+"loby"+intselect);
      var x=Number(selected.attr("transform").split("(")[1].split(")")[0].split(",")[0])-15;
      var y=Number(selected.attr("transform").split("(")[1].split(")")[0].split(",")[1])-15;
      var avirer = d3.selectAll("g.arc:not(.cercle"+i+").loby"+intselect);
      avirer.transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("opacity", 0.3)

      avirer.select("path")
        .transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("fill", "gray");

      createHoverText(intselect,d,i,x,y);

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
        removeHoverText();
        // Suppression de l'événement
        cercles.on("mouseout", null)

      })

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
    avirer.transition()
          .duration(0)
          .delay(CONST.TIMETRANSITION)
          .attr("opacity", 0)

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
    selected.select("foreignObject.arctext")
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
      choices.push(CONST.ALLTHEMELIST[intselect][indice]);
      nbloby = CONST.ALLPIEZEDDATA[CONST.ALLPIEZEDDATA.length-1][indice].data;
      console.log("nbloby = "+nbloby);
      tabnbloby.push(nbloby);
      console.log(tabnbloby);
}

// Fonction qui crée les nouvelles sections
function createsection (inttosee){
  var sections = d3.select("#sections");
  for (var i=currentIndex+1; i<currentIndex+6; i++){
    sections.select("#sec"+i).remove()
  }
  var section = sections
                  .append("section")
                  .attr("id", "sec"+(inttosee+5))
  section.append("h1");
  section.append("p").attr("class", "texte");
  section.append("p").attr("class", "appel");
  writeTextInSection(inttosee+5);
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
  CONST.ALLTHEMELIST[inttosee]=[];
  piedata=[];
  for (var i=0; i<datafiltre.length; i++){
    var donnee = datafiltre[i][nextissue]
    var indice = CONST.ALLTHEMELIST[inttosee].indexOf(donnee);
    if (indice===-1){
      CONST.ALLTHEMELIST[inttosee].push(donnee);
      piedata.push(1);
    } else {
      piedata[indice]++;
    }
  }
  CONST.ALLPIEZEDDATA[inttosee] = pie(piedata);
}


// On charge les nouvelles données
function loadNewData (inttosee){
  if (nbloby===1){
    CONST.ALLDATAFILTRE[inttosee]=CONST.ALLDATAFILTRE[inttosee-1].slice();
    // On filtre les données pour ne garder que le résultat
    var nbchoix = choices.length;
    for (var i=0; i<CONST.ALLDATAFILTRE[inttosee-1].length; i++){
      if (nbchoix>=2){
        if (CONST.ALLDATAFILTRE[inttosee-1][i][choices[0]]!==choices[1]){
          CONST.ALLDATAFILTRE[inttosee][i]=0
        }
      }
      if (nbchoix>=3){
        if (CONST.ALLDATAFILTRE[inttosee-1][i]["Type"]!==choices[2]){
          CONST.ALLDATAFILTRE[inttosee][i]=0
        }
      }
      if (nbchoix>=4){
        if (CONST.ALLDATAFILTRE[inttosee-1][i]["Secteurs d’activité"]!==choices[3]){
          CONST.ALLDATAFILTRE[inttosee][i]=0
        }
      }
      if (nbchoix>=5){
        if (CONST.ALLDATAFILTRE[inttosee-1][i]["Pays/Région"]!==choices[4]){
          CONST.ALLDATAFILTRE[inttosee][i]=0
        }
      }
      if (nbchoix>=6){
        if (CONST.ALLDATAFILTRE[inttosee-1][i]["Nom1"]!==choices[5]){
          CONST.ALLDATAFILTRE[inttosee][i]=0
        }
      }
    } 
    while (CONST.ALLDATAFILTRE[inttosee].indexOf(0)!==-1){
      CONST.ALLDATAFILTRE[inttosee].splice(CONST.ALLDATAFILTRE[inttosee].indexOf(0), 1);
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
    CONST.ALLPIEZEDDATA[inttosee] = pie(piedata);
    CONST.ALLTHEMELIST[inttosee] = ["SUPPORT", "OPPOSE"];
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
  console.log(CONST.ALLPIEZEDDATA[inttosee]);
  arc = d3.arc()
                .innerRadius(0)
                .outerRadius(outerRadius);

  CONST.QUEST.ARCS[inttosee] = svg.selectAll("g.xxx")
          .data(CONST.ALLPIEZEDDATA[inttosee])
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

  CONST.QUEST.ARCS[inttosee].append("foreignObject")
    .attr("class", "arctext")
    .attr("width", CONST.QUEST.TEXT.width)
    .attr("height", CONST.QUEST.TEXT.height)
    .attr("transform", function (d,i) {
      var string = "translate(";
      var angle = 0.5 * (CONST.ALLPIEZEDDATA[inttosee][i].startAngle + CONST.ALLPIEZEDDATA[inttosee][i].endAngle);
      var textpos = this.getBoundingClientRect();
                // attention position
      if ((angle>Math.PI) && (d.index>4) && (d.index===CONST.ALLPIEZEDDATA[inttosee].length-1)){
        string += (coefeloign(inttosee,d) * outerRadius * Math.sin(angle));
      } else if (angle>Math.PI){
        string += (coefeloign(inttosee,d) * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
      } else {
        string += (coefeloign(inttosee,d) * outerRadius * Math.sin(angle));
      }
      string += ', ';
      string += (-coefeloign(inttosee,d) * outerRadius * Math.cos(angle));
      string += ")";
      return string;
    })
    .html(function (d,i){
      return "<p style='font-size="+0.45*CONST.VUE.WIDTH/CONST.VUE.HEIGHT+"em"+"'>"+CONST.ALLTHEMELIST[inttosee][i]+"</p>"
    })
}

CONST.RESULT = {};
CONST.RESULT.width = 0.45*CONST.VUE.WIDTH;
CONST.RESULT.height = 1.3744*CONST.RESULT.width;
CONST.RESULT.x = 0.5*CONST.VUE.WIDTH - 0.5*CONST.RESULT.width;
CONST.RESULT.y = 0.07*CONST.VUE.HEIGHT;
CONST.RESULT.titlepos = {x: 0.32*CONST.VUE.WIDTH,y: 0.2*CONST.VUE.HEIGHT};
CONST.RESULT.parag1pos = {x: 0.32*CONST.VUE.WIDTH,y: 0.35*CONST.VUE.HEIGHT};
CONST.RESULT.parag2pos = {x: 0.32*CONST.VUE.WIDTH,y: 0.52*CONST.VUE.HEIGHT};
CONST.RESULT.parag3pos = {x: 0.32*CONST.VUE.WIDTH,y: 0.69*CONST.VUE.HEIGHT};
CONST.RESULT.pastitle = 15;
CONST.RESULT.pas = 22;
CONST.RESULT.tabulation = 20;
// Génération du résultat final s'il est connu
function generateResult (){
  // nbloby === 1

  // Création des éléments graphiques
  var user = CONST.ALLDATAFILTRE[CONST.ALLDATAFILTRE.length-1][0]
  CONST.RESULT.D3 = svg.append("g").attr("class", "result").attr("opacity", 0);

  CONST.RESULT.D3.append("image")
                  .attr("x", CONST.RESULT.x)
                  .attr("y", CONST.RESULT.y)
                  .attr("href", "img/fichebleue.png")
                  .attr("width", CONST.RESULT.width)
                  .attr("height", CONST.RESULT.height)

  var title = CONST.RESULT.D3.append("text")
                  .attr("class", "title")
                  .attr("x", CONST.RESULT.titlepos.x)
                  .attr("y", CONST.RESULT.titlepos.y)
  title.append("tspan")
        .attr("class", "mainname")
        .attr("x", Number(d3.select("text.title").attr("x")))
        .attr("y", Number(d3.select("text.title").attr("y")))
        .text(user["Nom1"])
  title.append("tspan")
        .attr("class", "fullname")
        .attr("x", Number(d3.select("text.title").attr("x")))
        .attr("y", Number(d3.select("text.title").attr("y"))+CONST.RESULT.pastitle)
        .text(user["Nom2"])

  var parag1 = CONST.RESULT.D3.append("text")
                  .attr("class", "parag1")
                  .attr("x", CONST.RESULT.parag1pos.x)
                  .attr("y", CONST.RESULT.parag1pos.y)
  parag1.append("tspan")
        .attr("class", "paragtitle")
        .attr("x", Number(d3.select("text.parag1").attr("x"))+CONST.RESULT.tabulation)
        .attr("y", Number(d3.select("text.parag1").attr("y")))
        .text("STRUCTURE")
  parag1.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag1").attr("x")))
        .attr("y", Number(d3.select("text.parag1").attr("y"))+CONST.RESULT.pas)
        .text("Type : "+user["Type"])
  parag1.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag1").attr("x")))
        .attr("y", Number(d3.select("text.parag1").attr("y"))+2*CONST.RESULT.pas)
        .text("Secteur : "+user["Secteurs d’activité"])
  parag1.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag1").attr("x")))
        .attr("y", Number(d3.select("text.parag1").attr("y"))+3*CONST.RESULT.pas)
        .text("Pays/Région : "+user["Pays/Région"])

  var parag2 = CONST.RESULT.D3.append("text")
                  .attr("class", "parag2")
                  .attr("x", CONST.RESULT.parag2pos.x)
                  .attr("y", CONST.RESULT.parag2pos.y)
  parag2.append("tspan")
        .attr("class", "paragtitle")
        .attr("x", Number(d3.select("text.parag2").attr("x"))+CONST.RESULT.tabulation)
        .attr("y", Number(d3.select("text.parag2").attr("y")))
        .text("LOBBYING")
  parag2.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag2").attr("x")))
        .attr("y", Number(d3.select("text.parag2").attr("y"))+CONST.RESULT.pas)
        .text("Dépenses de lobbying estimées (€) : "+user["Dépenses Lobby (€)"])
  parag2.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag2").attr("x")))
        .attr("y", Number(d3.select("text.parag2").attr("y"))+2*CONST.RESULT.pas)
        .text("Personnes impliquées : "+valueNAN(user["Personnes impliquées"]))
  parag2.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag2").attr("x")))
        .attr("y", Number(d3.select("text.parag2").attr("y"))+3*CONST.RESULT.pas)
        .text("Equivalent temps plein : "+valueNAN(user["Equivalent Temps plein"]))

  var parag3 = CONST.RESULT.D3.append("text")
                  .attr("class", "parag3")
                  .attr("x", CONST.RESULT.parag3pos.x)
                  .attr("y", CONST.RESULT.parag3pos.y)
  parag3.append("tspan")
        .attr("class", "paragtitle")
        .attr("x", Number(d3.select("text.parag3").attr("x"))+CONST.RESULT.tabulation)
        .attr("y", Number(d3.select("text.parag3").attr("y")))
        .text("POSITION")
  for (var i=0; i<CONST.ALLTHEMELIST[0].length; i++){
    parag3.append("tspan")
        .attr("class", "item")
        .attr("x", Number(d3.select("text.parag3").attr("x")))
        .attr("y", Number(d3.select("text.parag3").attr("y"))+(i+1)*CONST.RESULT.pas)
        .text(CONST.ALLTHEMELIST[0][i]+" : "+valueNAN(user[CONST.ALLTHEMELIST[0][i]]))
  }


  // MAJ des données de answers
  d3.select("span.type").text(user["Type"]);
  d3.select("span.secteur").text(user["Secteurs d’activité"]);
  d3.select("span.country").text(user["Pays/Région"]);
  d3.select("span.nom").text(user["Nom1"]);
  resetcolors();
  d3.select("p.nom").style("color", colorlastanswer);
  if (choices.length<=5){
    d3.select("p.country").style("color", colorlastanswer);
  }
  if (choices.length<=4){
    d3.select("p.secteur").style("color", colorlastanswer);
  }
  if (choices.length<=3){
    d3.select("p.type").style("color", colorlastanswer);
  }
  d3.select("p.secteur").style("display", "block");
  d3.select("p.country").style("display", "block");
  d3.select("p.nom").style("display", "block");
}

function eraseResult(){
  svg.select("g.result").remove();
}

// Gestion du choix utilisateur : click
function clickable (intselect,alpha){
  if (alpha>=1){
    var cercles = d3.selectAll("g.loby"+intselect+" path")
            .style("cursor", "pointer");
    cercles.on("click", function (d,i){
      // On supprime l'écoute de l'événement et les cartouches foreignObject
      cercles.on("mouseover", function (){});
      cercles.on("mouseout", function (){});
      cercles.on("click", function (){});
      removeHoverText();

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

      // On charge les données pour le choix suivant s'il y en a un
      loadNewData(intselect+1);
      if (nbloby===1){
        // Création des nouvelles sections  
        createsection(6);
        majsectionspos();
        generateResult();
        resultindex=intselect+6;
        setlinkURL();
      } else {
        // Création des nouvelles sections  
        createsection(intselect+1);
        majsectionspos();
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
  // Définir ici les alphasteps de la section 5
  var alphasteps = [0,0.6,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On s'assure que la fiche est invisible
    CONST.QUEST.D3.select("image").attr("y", CONST.VUE.HEIGHT+CONST.QUEST.FICHE.y);
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
    CONST.QUEST.D3.select("image").attr("y", (1-beta)*CONST.VUE.HEIGHT+CONST.QUEST.FICHE.y);
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
    CONST.QUEST.D3.select("image").attr("y", CONST.QUEST.FICHE.y);
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
          var angle = 0.5 * (CONST.ALLPIEZEDDATA[intselect][i].startAngle + CONST.ALLPIEZEDDATA[intselect][i].endAngle);
          if (angle>Math.PI){
            return "translate("+(0.5*CONST.VUE.WIDTH+beta*0.2*CONST.VUE.WIDTH*Math.sin(angle))+", "+(0.5*CONST.VUE.HEIGHT+(-beta*0.2*CONST.VUE.HEIGHT*Math.cos(angle)))+")"    
          } else {
            return "translate("+(0.5*CONST.VUE.WIDTH+beta*0.15*CONST.VUE.WIDTH*Math.sin(angle))+", "+(0.5*CONST.VUE.HEIGHT+(-beta*0.15*CONST.VUE.HEIGHT*Math.cos(angle)))+")"
          }   
        });
}

// Fermeture d'une part de pie en une nouvelle pie
function pieToCircles (intselect, beta){
  var cercles = d3.selectAll("g.loby"+intselect+" path");
  var textes = d3.selectAll("g.loby"+intselect+" foreignObject.arctext");
  cercles
        .attr("d", arc.endAngle(function (d){
          return d.endAngle + 2*Math.PI*beta;
        }))
        .attr("d", arc.outerRadius(function (d){
          return (1-0.2*beta*(1/scalablesize(intselect,d.data)))*outerRadius;
        }))
  textes
        .attr("transform", function (d,i) {
          var string = "translate(";
          var angle = 0.5 * (CONST.ALLPIEZEDDATA[intselect][i].startAngle + CONST.ALLPIEZEDDATA[intselect][i].endAngle);
          var textpos = this.getBoundingClientRect();
                    // attention position                 // position initiale du dernier quart
          if ((angle>Math.PI) && (d.index>4) && (d.index===CONST.ALLPIEZEDDATA[intselect].length-1) && (choices.length!==0)){
            string += ((coefeloign(intselect,d)-0.4*beta) * outerRadius * Math.sin(angle));
          } else if (angle>Math.PI){
            string += ((coefeloign(intselect,d)-0.4*beta) * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
          } else {
            string += ((coefeloign(intselect,d)-0.4*beta) * outerRadius * Math.sin(angle));
          }
          string += ', ';
          string += (-(coefeloign(intselect,d)-0.4*beta) * outerRadius * Math.cos(angle));
          string += ")";
          return string;
        })
}

// Gestion de la section .loby${intselect}
function manageSecX (intselect,pos){
  var startsection = sectionPositions[4+intselect];
  var alpha = (pos - startsection)/scrollheight;
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
    pieToCircles(intselect, 0);
  } else if (alpha<=1){
    // On s'assure les parts sont bien éclatées
    pieSplash(intselect,1);
    // On referme les parts 
    var beta = abTo01(alphasteps[2],1,alpha);
    pieToCircles(intselect, beta);
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

function displayResult(intselect,pos){
  var startsection = sectionPositions[4+intselect];
  var alpha = (pos - startsection)/scrollheight;
  // Définir ici les alphasteps de la section
  var alphasteps = [0,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  var old = d3.selectAll("g.loby"+(intselect-1));
  var newer = d3.select("g.result")
  var fich = d3.select("g.quest").select(".fiche")
  if (alpha<=0){
    transitOpacity(old,newer,0);
    fich.attr("opacity", 1);
  } else if (alpha<=1){
    transitOpacity(old,newer,alpha);
    fich.attr("opacity", 1-alpha);
  } else {
    transitOpacity(old,newer,1);
    fich.attr("opacity", 0);
  }
}

// Pour le retour en arrière

// Fonction qui supprime les sections en trop
function removelastsection (intselect){
  var sections = d3.select("#sections").selectAll("section");
  var nbsections = sections["_groups"][0].length
  // Sécurité : on ne supprime pas les sections 0, 1, 2, 3, 4 et 5
  if (nbsections>6){
      // La dernière section a l'id #sec${nbsections-1}
    var avirer = d3.select("#sec"+(intselect+6));
    avirer.select("h1").html("");
    avirer.select("p.texte").html("");
    avirer.select("p.appel").html("Retournez plus haut !");
    // On supprime le dernier élément de CONST.ALLDATAFILTRE
    CONST.ALLDATAFILTRE.splice(intselect+1,1);
    // On supprime les cercles associés à cette section
    CONST.QUEST.ARCS[intselect+1].remove();
    CONST.QUEST.ARCS.splice(intselect+1,1);
    // On supprime la dernière entrée de tabnbloby et on remet nbloby à jour
    tabnbloby.splice(intselect+1,1);
    nbloby = tabnbloby[tabnbloby.length-1];
    // On supprime la liste des thèmes associée
    CONST.ALLTHEMELIST.splice(intselect+1,1);
    // On supprime la piezeddata associée
    CONST.ALLPIEZEDDATA.splice(intselect+1,1);
    // On supprime le dernier choix
    choices.splice(intselect,1);
  }
}

// Après le clic, des cercles sont virés, et le cercle choisi est aggrandi au centre
// Cette fonction remet tout le monde à sa place
function resetcircles (intselect){
  var cercles = d3.selectAll("g.loby"+intselect+" path");
  var textes = d3.selectAll("g.loby"+intselect+" foreignObject.arctext");
  // On remet les cercles à leur place
  pieSplash(intselect, 1);
  pieToCircles(intselect, 1);
  // Couleur des cercles
  cercles.attr("fill", function (d,i){
    return color(i);
  })
  // On affiche les cercles et leurs textes avec une animation
  CONST.QUEST.ARCS[intselect].transition()
                  .duration(CONST.TIMETRANSITION)
                  .attr("opacity", 1);
}

function cancelChoiceAnswer(intselect){
  resetcolors();
  var cancelclass;
  var removeclass;
  switch (intselect){
    case 0:
      cancelclass = ["span.theme","span.position","span.type","span.secteur","span.country","span.nom"];
      removeclass = ["p.position","p.type","p.secteur","p.country","p.nom"];
      break;
    case 1:
      cancelclass = ["span.position","span.type","span.secteur","span.country","span.nom"];
      removeclass = ["p.type","p.secteur","p.country","p.nom"];
      break;
    case 2:
      cancelclass = ["span.type","span.secteur","span.country","span.nom"];
      removeclass = ["p.secteur","p.country","p.nom"];
      break;
    case 3:
      cancelclass = ["span.secteur","span.country","span.nom"];
      removeclass = ["p.country","p.nom"];
      break;
    case 4:
      cancelclass = ["span.country","span.nom"];
      removeclass = ["p.nom"];
      break;
    case 5:
      cancelclass = ["span.nom"];
      removeclass = [];
      break;
  }
  cancelclass.forEach(function (selector){
    // On supprime le texte écrit
    d3.select("#answers").select(selector).text("");
  })
  removeclass.forEach(function (selector){
    // On rend l'élément invisible
    d3.select("#answers").select(selector).style("display", "none");
  })
}