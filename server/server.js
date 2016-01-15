var express = require("express")
var MongoClient = require("mongodb").MongoClient
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var md5 = require("md5")


var url = "mongodb://localhost:27017/oumaziz_web"
var app = express()

app.use(express.static("public"));
app.use("/bower_components", express.static("bower_components"));

app.use(cookieParser())
app.use(session({"secret": "RMratsy2T2SLpwMvqglnkleW43j40iKp"}))

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

MongoClient.connect(url, function(err, db) {
	db.collection("users", function(err, users) {

		app.post('/users/register', function(req, res) {
			console.log(req.body.pseudo+" "+req.body.email+" "+req.body.password)

			if(req.body.password.length < 6) return res.json({error:"Mot de passe trop court"}).end()
				if(req.body.pseudo.length < 6) return res.json({error:"Pseudo trop court"}).end()	
					users.findOne({email:req.body.email}, function(err, user){

						if(err) return;

						if (user != null) res.json({error:"Ce compte existe déjà"}).end()	
							else{
								users.insert({email:req.body.email, password:md5(req.body.password), pseudo:req.body.pseudo}, function(err, user){
									res.json(user.ops[0]).end()
								})
							}
						})
			});

		app.post('/users/login', function(req, res) {
			users.findOne({email:req.body.email, password:md5(req.body.password)}, function(err, user){

				if(err) return;

				if (user == null) res.json({error:"Identifiants incorrects"}).end()
					else{
						req.session.user = user
						res.json(user)
					}	
				})
		});

		app.get('/users/logout', function(req, res) {
			req.session.user = null
			res.end()
		});

		app.post('/users/friends', function(req, res) {

			if (req.body.email != req.session.user.email) {
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
							db.collection("friends", function(err, friends) {
								friends.findOne( { 
									$or : [ 
									{$and : [ { "user.email" : CurrentUser.email }, { "friend.email": Friend.email} ]},
									{$and : [ { "friend.email" : CurrentUser.email }, { "user.email": Friend.email} ]}
									] 
								}, function(err, friend){

									if(err) return;

									if (friend == null){

										friends.insert({user:CurrentUser, friend:Friend}, function(err, friends){
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
		});




		app.get('/users/friends', function(req, res) {

			var CurrentUser = {
				email : req.session.user.email,
				pseudo : req.session.user.pseudo
			}

			console.log(CurrentUser)

			db.collection("friends", function(err, friends) {
				var cursor = friends.find({$or : [ { user : CurrentUser }, { friend : CurrentUser } ]})
				cursor.toArray(function(err, data) {
					if (err) return next(err)
						console.log(data)
						var tab = new Array()
					var length = Object.keys(data).length; 
					for (var i = 0; i <length; i++) 
					{
						if(data[i].friend == CurrentUser)
							tab[i] = data[i].user;  
						else tab[i] = data[i].friend;  

					}	

					console.log(tab)
					res.jsonp(tab)
				})
			})
		});

	})

	db.collection("groups", function(err, groups) {


		app.get('/users/groups', function(req, res) {
			var cursor = groups.find({membres: {$elemMatch: {email:req.session.user.email}}})
			cursor.toArray(function(err, data) {
				if (err) return next(err)
					var tab=new Array()
				var length = Object.keys(data).length; 
				for (var i = 0; i <length; i++) 
				{	
					tab[i]= {}
					tab[i].nameGroupe= data[i].nameGroupe;
					tab[i].membres=new Array();

					if(data[i].membres.email != req.session.user.email)
						tab[i].membres = data[i].membres.pseudo;    

				}	
				res.jsonp(tab)
			})

		});

		app.post('/users/groups', function(req, res) {


			groups.insert({nameGroupe:req.body.nameGroupe, membres:req.body.groups}, function(err, groups){
				console.log("Insertion groupe reussie")
				res.json(groups.ops[0]).end()
			})

		});
	})

	app.listen(3000, function() {
		console.log("Server running...")
	})
})
