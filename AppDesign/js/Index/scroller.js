// Initialisation de l'indice de section active
var sectionlist;
var currentIndex = -1;
var sectionPositions;
var maxindex;
var prevIndex = -1;

majsectionspos();
position();
console.log(sectionPositions)

function majsectionspos(){
  sectionlist = d3.select("#sections").selectAll("section");

  // On obtient les positions des différentes sections
  sectionPositions = [];
  var startPos;
  sectionlist.each(function (d,i) {
    var top = this.getBoundingClientRect().top;
    if(i === 0) {
      startPos = top;
    }
    // Le décalage de 350 permet d'ajuster les sections lors du scroll
    sectionPositions.push(350 + top - startPos);
  });
  maxindex = sectionPositions.length-1;
}

// Détermine notre position sur la page et adapte la vue. 
function position() {

  // Repérage de la position sur la page
  var pos = window.pageYOffset;
  // On détermine la section active
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sectionlist.size() - 1, sectionIndex);
  // Si on change la section active
  if (currentIndex !== sectionIndex) {
    // Mise à jour de la section active
    prevIndex = currentIndex;
    currentIndex = sectionIndex;
    console.log("Section : "+currentIndex)
    // Mise en place des modifications de la vue : changement de couleur
    majvue.call(this, sectionIndex);
  }
  displayInitFigure();
  scrollAnim(currentIndex, pos);
  visiblelink();
}

// Fonction à appeler pour mettre la vue à jour
// argument index : indice de la nouvelle section
function majvue(index) {
  manageBadgeSec4();
}

function scrollAnim(index, pos) {
  switch (index){
  case 1:
    manageFicheSec1(pos);
    break;
  case 2:
    manageFicheSec2(pos);
    break;
  case 3:
    manageFicheBadgeSec3(pos);
    break;
  case 4:
    break; // On gère dans majvue
  case 5:
    manageSec5(pos);
    break;
  }
}

// On déclenche la fonction position à chaque scroll de la page
d3.select(window)
  .on("scroll.scroller", function(){
    majsectionspos();
    position();
  });