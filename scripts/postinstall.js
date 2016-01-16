var exec = require('child_process').exec;
function puts(error, stdout, stderr) { 
	if(!error) console.log("\nSUCCESS : " + stdout)
	else console.log("\nERROR :\n" + error)
}

// Liste des commandes
exec("bower install", puts)
exec("mongoimport --db oumaziz_web --collection demo demo.json", puts)