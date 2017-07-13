// L'élément lien vers le réseau
var link = document.getElementById("network");

function setlinkURL (){
  if (nbloby===1){
    var ID = CONST.ALLDATAFILTRE[CONST.ALLDATAFILTRE.length-1][0]["ID"];
    var themeid = idToTheme.indexOf(choices[0]);
    link.setAttribute("href", "reseau.html?theme="+themeid+"&id="+ID);
  }
}

function visiblelink (){
  if (nbloby===1){
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
      link.style.display = "block";
    } else {
      link.style.display = "none";
    }
  }
}