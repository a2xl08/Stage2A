/* Ce script gère le rechargement de la page par l'utilisateur
via F5 ainsi que le bouton #reloadbox qui recharge la page depuis
 le début */

window.onbeforeunload = function(){
  window.scrollTo(0,0);
}

// L'affichage des crédits
var opener = document.getElementById("opencredits");
var closer = document.getElementById("closecredits");
var element = document.getElementById("credits")
opener.addEventListener("click", function (){
  element.style.display = "block";
})
closer.addEventListener("click", function (){
  element.style.display = "none";
})