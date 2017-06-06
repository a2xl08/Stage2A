var returner = document.getElementById('reloadbox');

returner.addEventListener("click", function() {
	window.scrollTo(0,0);
	document.location.reload();
});