function rgbTOobject(colorString){
    var colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/),
    components = {};
	components.red = Number(colorsOnly[0]);
	components.green = Number(colorsOnly[1]);
	components.blue = Number(colorsOnly[2]);
	return components;
}

function objectTOrgb(objet){
	return "rgb("+objet.red+", "+objet.green+", "+objet.blue+")";
}

function colorstep(colorString1, colorString2, time){
	objet1 = rgbTOobject(colorString1);
	objet2 = rgbTOobject(colorString2);
	delta = {};
	delta.red = objet2.red - objet1.red;
	delta.green = objet2.green - objet1.green;
	delta.blue = objet2.blue - objet1.blue;
	delta.red = delta.red / time;
	delta.green = delta.green / time;
	delta.blue = delta.blue / time;
}