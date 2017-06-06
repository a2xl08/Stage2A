var returner = document.getElementById('reloadbox');

console.log("returner")

returner.addEventListener("click", function() {
	window.scrollTo(0,0);
	document.location.reload();
});