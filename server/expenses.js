exports.group = function(req, res) {	

	if(req.body.payer == null) return res.json({"error" : "Veuillez saisir tous les champs."})
		if(req.body.balance == null) return res.json({"error" : "Veuillez saisir tous les champs."})
			if(req.body.payer == null) return res.json({"error" : "Veuillez saisir tous les champs."})

				if(err) return res.json({"error" : "accès impossible à la base de données."});

			var cursor = groups.find({"_id":mongo.ObjectID(req.body.groupe)})

			cursor.toArray(function(err, data) {

				for (var i = req.body.balance.length - 1; i >= 0; i--) {
					req.body.balance[i].user = req.body.balance[i].user.email
				};

				var expense = {
					"_id" : mongo.ObjectID(),
					"cost" : req.body.cost,
					"description" : req.body.description,
					"payer" : req.body.payer,
					"date" : req.body.date,
					"balance" : req.body.balance
				}

				data[0].expenses.push(expense)

				groups.update({"_id":data[0]._id}, {$set:{"expenses":data[0].expenses}}, function(err, result){
					console.log("le update retourne : "+result)
					res.json(data[0])
				})
			})
		}

exports.friend = function(req, res) {	

	if(req.body.payer == null) return res.json({"error" : "Veuillez saisir tous les champs."})
		if(req.body.owe == null) return res.json({"error" : "Veuillez saisir tous les champs."})
			if(err) return res.json({"error" : "accès impossible à la base de données."});

		var cursor = friends.find(
		{ 
			$or : [ 
			{$and : [ { "user.email" : req.session.user.email}, { "friend.email": req.body.friend} ]},
			{$and : [ { "friend.email" : req.session.user.email }, { "user.email": req.body.friend} ]}
			] 
		}
		)

		cursor.toArray(function(err, data) {

			var expense = {
				"_id" : mongo.ObjectID(),
				"cost" : req.body.cost,
				"description" : req.body.description,
				"payer" : req.body.payer,
				"date" : req.body.date,
				"owe" : req.body.owe
			}

			data[0].expenses.push(expense)

			friends.update({"_id":data[0]._id}, {$set:{"expenses":data[0].expenses}}, function(err, result){
				res.json(data[0])
			})
		})
	}