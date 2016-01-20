exports.add = function(req, res) {

	if (req.body.email != req.session.user.email) {
		if(req.body.pseudo.length < 4) return res.json({error:"Pseudo trop court"}).end()
			users.findOne({email:req.body.email}, function(err, user){

				if(err) return;

				if (user == null) res.json({error:"Ce compte n'existe pas"}).end()

					else{

						var CurrentUser = {
							email : req.session.user.email,
							pseudo : req.session.user.pseudo
						}

						var Friend = {
							email : req.body.email,
							pseudo : req.body.pseudo
						}

						var Expenses= new Array();


						db.collection("friends", function(err, friends) {

							friends.findOne( { 
								$or : [ 
								{$and : [ { "user.email" : CurrentUser.email }, { "friend.email": Friend.email} ]},
								{$and : [ { "friend.email" : CurrentUser.email }, { "user.email": Friend.email} ]}
								] 
							}, function(err, friend){

								if(err) return;

								if (friend == null){

									friends.insert({user:CurrentUser, friend:Friend, expenses:Expenses }, function(err, friends){
										console.log("Insertion ami reussie")
										res.json(friends.ops[0]).end()

									})
								}

								else res.json({error:"Vous êtes déjà ami !"}).end()
							})
						})


					}

				})
} else res.json({error:"Vous ne pouvez pas vous ajouter comme ami !"}).end()
}


exports.show = function(req, res) {

	db.collection("friends", function(err, friends) {

		if(err) return;

		var cursor = friends.find({$or : [ { "user.email" : req.session.user.email }, { "friend.email" : req.session.user.email } ]})
		cursor.toArray(function(err, data) {
			if (err) return next(err)

				var tab = new Array()
			var length = Object.keys(data).length; 
			for (var i = 0; i <length; i++) 
			{
				tab[i] = {};
				tab[i]._id = data[i]._id;
				tab[i].expenses=new Array();
				tab[i].expenses=data[i].expenses;

				if(data[i].friend.email == req.session.user.email){
					tab[i].email = data[i].user.email; 
					tab[i].pseudo = data[i].user.pseudo;  }

					else {	

						tab[i].email = data[i].friend.email;  
						tab[i].pseudo = data[i].friend.pseudo;  


					}

				}	

				res.jsonp(tab)
			})
	})
}

exports.remove = function(req, res) {

	db.collection("friends", function(err, friends) {
		friends.remove( { $or : [ 
			{$and : [ { "user.email" : req.session.user.email }, { "friend.email": req.params.email} ]},
			{$and : [ { "friend.email" : req.session.user.email }, { "user.email": req.params.email} ]}
			] 
		}, function(err, friend){
			if(err) return;
			console.log("ami supprimé")
			res.send("ami supprimé")
		}
		)
	})
}

exports.update = function(req, res) {
	db.collection("friends", function(err, friends) {
		friends.findOne( { $or : [ 
			{$and : [ { "user.email" : req.session.user.email }, { "friend.email": req.body.CurrentFriend.email} ]},
			{$and : [ { "friend.email" : req.session.user.email }, { "user.email": req.body.CurrentFriend.email} ]}
			] 
		},function(err, friend){
			if(err) return;
			if(friend.user.email == req.session.user.email )
			{
				friends.update( {_id: friend._id},
					{$set: {"friend.pseudo": req.body.CurrentFriend.pseudo
				}},function(err, friend){
					console.log("ami modifié") 
					res.send("ami modifié")

				})

			}
			else {
				friends.update( { _id: friend._id},{$set:{
					"user.pseudo": req.body.CurrentFriend.pseudo
				}},function(err, friend){
					console.log("ami modifié");
					res.send("ami modifié")

				})
			}
		}
		)
	})			
}