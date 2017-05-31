sectionlist = d3.selectAll("section");

// Initialisation de l'indice de section active
var currentIndex = -1;
position();

// Détermine notre position sur la page et adapte la vue. 
function position() {
  // On obtient les positions des différentes sections
  sectionPositions = [];
  var startPos;
  sectionlist.each(function(d,i) {
    var top = this.getBoundingClientRect().top;
    if(i === 0) {
      startPos = top;
    }
    sectionPositions.push(top - startPos);
  });

  // Repérage de la position sur la page, le -500 correspond au décalage initial de la section 1
  var pos = window.pageYOffset - 500;
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
    	d3.select("#vue").style("background-color", "#b1bcce");
      displayaxe1();
  } else if (index === 1){
    	d3.select("#vue").style("background-color", "#efd2aa");
      displayaxe2();
  } else if (index === 2){
    	d3.select("#vue").style("background-color", "#b0d8af");
      displayaxe3();
  }
}

// On déclenche la fonction position à chaque scroll de la page
d3.select(window)
  .on("scroll.scroller", position);