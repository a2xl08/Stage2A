sectionlist = d3.selectAll("section");
console.log(sectionlist);
// Initialisation de l'indice de section active
var currentIndex = -1;
var dispatch = d3.dispatch("active", "progress");

// On obtient les positions des différentes sections grâce à ce code
sectionPositions = [];
var startPos;
sectionlist.each(function(d,i) {
  var top = this.getBoundingClientRect().top;
  console.log("top = " + top);
  if(i === 0) {
    startPos = top;
    console.log("startPos = " + startPos);
  }
  sectionPositions.push(top - startPos);
  console.log(sectionPositions);
});

// Détermine notre position sur la page et si on doit changer la vue. 
function position() {
  console.log("Fonction position appelée");
  // Repérage de la position sur la page, le -500 correspond au décalage initial de la section 1
  var pos = window.pageYOffset - 500;
  console.log("pos = "+pos);
  // On détermine la section active
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sectionlist.size() - 1, sectionIndex);
  console.log("sectionIndex = "+sectionIndex);
  // Si on change la section active
  if (currentIndex !== sectionIndex) {
  	console.log("On change !");
    //dispatch.active(sectionIndex);
    // Mise à jour de la section active
    currentIndex = sectionIndex;
    // Mise en place des modifications de la vue : changement de couleur
    if (currentIndex === 0){
    	d3.select("#vue").style("background-color", "blue");
    } else if (currentIndex === 1){
    	d3.select("#vue").style("background-color", "red");
    } else if (currentIndex === 2){
    	d3.select("#vue").style("background-color", "green");
    }
  }
}

// On déclenche la fonction position à chaque scroll de la page
d3.select(window)
  .on("scroll.scroller", position);

