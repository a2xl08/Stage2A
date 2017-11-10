var dataset;
var numreliefs;

d3.csv("data/newspeedAxe1.csv", function (data){

	dataset = data["columns"].map(Number);
	numreliefs = dataset.length;

})