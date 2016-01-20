function makeEmail() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text+"@exemple.fr";
}

exports.show = function(req, res) {

	    //groupes non partagé
	    //var cursor = groups.find({"membres.0.email": req.session.user.email})
	    //dans le cas du pseudo juste
	    //			var cursor = groups.find({membres: { $all:[req.session.user.pseudo]}})
	    //dans le cas des groupes partagé
	    var cursor = groups.find({membres: {$elemMatch: {email:req.session.user.email}}})
	    cursor.toArray(function(err, data) {
	    	if (err) return next(err)

	    		var tab=new Array()
	    	var length = Object.keys(data).length; 
	    	for (var i = 0; i <length; i++) 
	    	{	

	    		tab[i]= {}
	    		tab[i]._id = data[i]._id;
	    		tab[i].nameGroupe= data[i].nameGroupe;
	    		tab[i].membres=new Array();
	    		var k=0;
	    		var lengthMembres = Object.keys(data[i].membres).length;
	    		for (var j = 0; j <lengthMembres; j++) 
	    		{

	    			tab[i].membres[k] = { pseudo: data[i].membres[j].pseudo,
	    				email: data[i].membres[j].email
	    			}
	    			k++;


	    		}
	    		tab[i].expenses=new Array();
	    		tab[i].expenses=data[i].expenses;

	    	}

	    	res.jsonp(tab)
	    })

	}

	exports.add = function(req, res) {
		if(req.body.nameGroupe.length < 4) return res.json({error:"Nom du groupe trop court"}).end()
			var lengthMembres = Object.keys(req.body.membres).length;
		for (var j = 0; j <lengthMembres; j++) 
		{
			if(req.body.membres[j].pseudo.length < 4) return res.json({error:"Pseudo trop court"}).end()
			if((req.body.CurrentGroup.membres[j].email == null) || (req.body.CurrentGroup.membres[j].email.length == 0)) 
				req.body.CurrentGroup.membres[j].email = makeEmail();

		}
		var Expenses= new Array();
		groups.insert({nameGroupe:req.body.nameGroupe, membres:req.body.membres , expenses:Expenses}, function(err, groups){
			console.log("Insertion groupe reussie")
			res.json(groups.ops[0]).end()
		})

	}

	exports.remove = function(req, res) {


		groups.remove( { _id: mongo.ObjectID(req.params.idG)}, function(err, group){
			if(err) return;
			console.log("group supprimé")
			res.send("group supprimé")
		}
		)



	}

exports.update = function(req, res) {

	if(req.body.CurrentGroup.nameGroupe.length < 4) return res.json({error:"Nom du groupe trop court"}).end()
		var lengthMembres = Object.keys(req.body.CurrentGroup.membres).length;
	for (var j = 0; j <lengthMembres; j++) 
	{
		if(req.body.CurrentGroup.membres[j].pseudo.length < 4) return res.json({error:"Pseudo trop court"}).end()
			if((req.body.CurrentGroup.membres[j].email == null) || (req.body.CurrentGroup.membres[j].email.length == 0)) req.body.CurrentGroup.membres[j].email = makeEmail();

	}
	

	
	groups.update( {_id: mongo.ObjectID(req.body.CurrentGroup._id)},
		{$set: {nameGroupe: req.body.CurrentGroup.nameGroupe, membres:req.body.CurrentGroup.membres
		}},function(err, friend){
			console.log("groupe modifié") 
			res.send("groupe modifié")

		})



}