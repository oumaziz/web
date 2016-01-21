var exec = require('child_process').exec;
function puts(error, stdout, stderr) { 
	if(error) console.log("\nERROR :\n" + error)
}

// Liste des commandes
exec("bower install", puts)
exec("mongoimport --db oumaziz_web --collection users scripts/database/users.json", puts)
exec("mongoimport --db oumaziz_web --collection friends scripts/database/friends.json", puts)
exec("mongoimport --db oumaziz_web --collection groups scripts/database/groups.json", puts)