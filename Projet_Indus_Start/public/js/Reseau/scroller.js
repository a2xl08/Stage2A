// Initialisation des variables gérant le scroll
// liste des sections
var sectionlist;
// Indice de la section active
var currentIndex = 0;
var prevIndex = 0;
// Positions des différentes sections sur la page
var sectionPositions;

// Mise à jour des positions dès le chargement de la page
majsectionspos();
// Adapte la vue à la position initiale au chargement de la page
//position();

// Met à jour les positions de toutes les sections sur la page
// Utile lors de la création de sections notamment
function majsectionspos(){
  sectionlist = d3.select("#sections").selectAll("section");

  // On obtient les positions des différentes sections
  sectionPositions = [];
  var startPos;
  sectionlist.each(function (d,i) {
    var top = this.getBoundingClientRect().top;
    if(i === 0) {
        // Calcul de la position de la section 0
      startPos = top;
    }
    // Le décalage de 350 permet d'ajuster les sections lors du scroll
    sectionPositions.push(350 + top - startPos);
  });
}


// Détermine notre position sur la page et adapte la vue.
function position(simulation) {

  // Repérage de la position sur la page
  var pos = window.pageYOffset;
  // On détermine la section active
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sectionlist.size() - 1, sectionIndex);
  // Si on change la section active
  if (currentIndex !== sectionIndex) {
    // Mise à jour de l'indice de section active
    prevIndex = currentIndex;
    currentIndex = sectionIndex;
    console.log("Section : "+currentIndex);
    // Mise en place des modifications de la vue : changement de couleur
    majvue.call(this, simulation, sectionIndex, prevIndex);
  }
  scrollAnim();
}

// Fonction à appeler pour mettre la vue à jour
// argument index : indice de la nouvelle section
function majvue(simulation, index, preced) {
  // Modifications lors d'un changement de section
  if (preced===index-1 && index<=6 && !storyactive){
    // On affiche la section suivante
    simulation.nextSection();
    if (connection){
      socket.emit("push Next", "");
    }
  } else if (preced===index+1 && preced<=6 && storyonread){
    // On retourne à la section précédente
    simulation.previousSection();
    simulation.previousSection();
    if (connection){
      socket.emit("push Prev", "");
    }
    // On force la fermeture de stories si ouvert
    storyonread = false;
    d3.select("svg#closestory").style("display", "none");
    storyactive = false;
    eraseLastSectionContent();
    writeBaseTextInLastSection();
    d3.select("svg.experimentation").selectAll(".storycircle").remove();
    d3.select("img#stories").on("click", onclickStories);
    d3.select("img#bestallyworstrival").on("click", onclickBestAlly);
  } else if (preced===index+1 && preced<=6 && storyactive){
    simulation.previousSection();
    if (connection){
      socket.emit("push Prev");
    }
    // On force la fermeture de stories si ouvert
    storyactive = false;
    eraseLastSectionContent();
    writeBaseTextInLastSection();
    d3.select("svg.experimentation").selectAll(".storycircle").remove();
    d3.select("img#stories").on("click", onclickStories);
    d3.select("img#bestallyworstrival").on("click", onclickBestAlly);
  } else if (preced===index+1 && preced<=6){
    simulation.previousSection();
    if (connection){
      socket.emit("push Prev");
    }
  } else if (index===9 && preced===8){
    if (connection){
      socket.emit("push newtheme", "");
    }
    anonymizeUser();
  } else if (index===8 && preced===9){
    if (connection){
      socket.emit("push backtheme", "");
    }
    rebornUser();
  } else if (index===8 && preced===9){
    updateLegendContent();
  }
  if (index===4 && preced===3){
    toscroll = false;
    createClickText();
  }
  if (index===3 && preced===4){
    toscroll = true;
  }
  if (index===7){
    clicklocknode = true;
    displayBesties();
  } else {
    d3.select("#bestally").remove();
    d3.select("#worstrival").remove();
    clicklocknode = false;
  }
  if (index===9){
    d3.selectAll("div.menu img").style("display", "inline-block");
    updaterectcoords();
    setTimeout(showanswers, 50);
  } else {
    d3.selectAll("div.menu img").style("display", "none");
    updaterectcoords();
  }
}

// Mettre dans cette fonction les transitions qui s"alignent sur le scroll utilisateur
// argument index : indice de la section active
// argument pos : position sur la page
// sectionPositions : liste des positions des sections (décalées pour permettre un scroll précis)
function scrollAnim(index, pos) {

}

// On déclenche la fonction position à chaque scroll de la page : dans le fichier experimentation pour avoir accès à simulation
