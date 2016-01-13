var express = require("express")
var MongoClient = require("mongodb").MongoClient
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')


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
			console.log(req.body.email+" "+req.body.password)

			if(req.body.password.length < 6) return res.json({error:"Mot de passe trop court"}).end()	
			users.findOne({email:req.body.email}, function(err, user){

				if(err) return;

				if (user != null) res.json({error:"Ce compte existe déjà"}).end()	
				else{
					users.insert({email:req.body.email, password:req.body.password}, function(err, user){
						res.json(user.ops[0]).end()
					})
				}
			})
		});

		app.post('/users/login', function(req, res) {
			users.findOne({email:req.body.email}, function(err, user){

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

	})

	app.listen(3000, function() {
		console.log("Server running...")
	})
})