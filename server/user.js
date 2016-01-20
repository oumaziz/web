exports.add = function(req, res) {

	if(req.body.password.length < 6) return res.json({error:"Mot de passe trop court"}).end()
	if(req.body.pseudo.length < 4) return res.json({error:"Pseudo trop court"}).end()	

	users.findOne({email:req.body.email}, function(err, user){

		if(err) return;

		if (user != null) res.json({error:"Ce compte existe déjà"}).end()	
		else{
			users.insert({email:req.body.email, password:md5(req.body.password), pseudo:req.body.pseudo}, function(err, user){
				req.session.user = user.ops[0]
				res.json(user.ops[0]).end()
			})
		}
	})
}

exports.disconnect = function(req, res) {
	req.session.user = null
	res.end()
}

exports.connect = function(req, res) {
	users.findOne({email:req.body.email, password:md5(req.body.password)}, function(err, user){

		if(err) return;

		if (user == null) res.json({error:"Identifiants incorrects"}).end()
		else{
			req.session.user = user
			res.json(user)
		}	
	})
}