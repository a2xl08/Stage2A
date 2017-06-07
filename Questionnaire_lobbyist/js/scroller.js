// Initialisation de l'indice de section active
var sectionlist;
var currentIndex = -1;
var sectionPositions;

majsectionspos();
position();

function majsectionspos(){
  sectionlist = d3.select("#sections").selectAll("section");
}


// Détermine notre position sur la page et adapte la vue. 
function position() {
  // On obtient les positions des différentes sections
  sectionPositions = [];
  var startPos;
  sectionlist.each(function (d,i) {
    var top = this.getBoundingClientRect().top;
    if(i === 0) {
      startPos = top;
    }
    // Le décalage de 500 permet d'ajuster les sections lors du scroll
    sectionPositions.push(350 + top - startPos);
  });

  // Repérage de la position sur la page
  var pos = window.pageYOffset;
  // On détermine la section active
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sectionlist.size() - 1, sectionIndex);
  // Si on change la section active
  if (currentIndex !== sectionIndex) {
    // Mise à jour de la section active
    currentIndex = sectionIndex;
    // Mise en place des modifications de la vue : changement de couleur
    majvue.call(this, sectionIndex);
  }
}

// Fonction à appeler pour mettre la vue à jour
// argument index : indice de la nouvelle section
function majvue(index) {
	if (index === 0){
    	d3.select("#vue").style("background-color", "rgb(193, 193, 193)");
  } else if (index === 1){
      d3.select("#vue").style("background-color", "rgb(145, 145, 145)");
  } 
}

// On déclenche la fonction position à chaque scroll de la page
d3.select(window)
  .on("scroll.scroller", position);