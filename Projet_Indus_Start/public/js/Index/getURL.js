function GETURL(param) {
  var vars = {};
  window.location.href.replace( location.hash, '' ).replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function( m, key, value ) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );

  if ( param ) {
    return vars[param] ? vars[param] : null;
  }
  return vars;
}

var params = GETURL();
var connection = (params["connect"]==="pilot");

if (connection){
  var socket = io.connect("http://localhost:8080");
  socket.emit("push index", "");
  document.getElementById("backlink").href = "index.html?connect=pilot";
}
