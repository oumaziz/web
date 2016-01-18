var express = require("express")
var mongo = require("mongodb")
var MongoClient = mongo.MongoClient
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var md5 = require("md5")


var url = "mongodb://localhost:27017/oumaziz_web"
var app = express()

app.use(express.static("public"));
app.use("/bower_components", express.static("bower_components"));

app.use(cookieParser())
app.use(session({
    secret: "RMratsy2T2SLpwMvqglnkleW43j40iKp",
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

MongoClient.connect(url, function(err, db) {
    db.collection("users", function(err, users) {

	app.post('/users/register', function(req, res) {


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
	});




	app.get('/users/friends', function(req, res) {

	    
	    db.collection("friends", function(err, friends) {

		var cursor = friends.find({$or : [ { "user.email" : req.session.user.email }, { "friend.email" : req.session.user.email } ]})
		cursor.toArray(function(err, data) {
		    if (err) return next(err)
		    console.log(data)
		    var tab = new Array()
		    var length = Object.keys(data).length; 
		    for (var i = 0; i <length; i++) 
		    {

			if(data[i].friend.email == req.session.user.email)
			    tab[i] = data[i].user;  
			else tab[i] = data[i].friend;  

		    }	

		    
		    res.jsonp(tab)
		})
	    })
	});

	app.delete('/users/friends/:email', function(req, res) {
	    
	    db.collection("friends", function(err, friends) {
		friends.remove( { $or : [ 
		    {$and : [ { "user.email" : req.session.user.email }, { "friend.email": req.params.email} ]},
		    {$and : [ { "friend.email" : req.session.user.email }, { "user.email": req.params.email} ]}
		] 
				}, function(err, friend){
				    if(err) return;
				    console.log("ami supprimé")
				}
			      )
	    })
	});

	app.post('/users/friends/update', function(req, res) {
		console.log(req.body.email);
			db.collection("friends", function(err, friends) {
			friends.findOne( { $or : [ 
						{$and : [ { "user.email" : req.session.user.email }, { "friend.email": req.body.email} ]},
						{$and : [ { "friend.email" : req.session.user.email }, { "user.email": req.body.email} ]}
									] 
					},function(err, friend){
					if(err) return;
			console.log(friend);		
if(friend.user.email == req.session.user.email )
{
	console.log("je suis la");
	friends.update( { $and : [ { "user.email" : req.session.user.email }, { "friend.email": req.body.email} ]},{
	"friend.pseudo": req.body.pseudo
	},function(err, friend){console.log("ami modifié") })
									
}
else {
	console.log("je suis pas la");
friends.update( { $and : [ { "user.email" : req.body.email }, { "friend.email": req.session.user.email} ]},{
	"user.pseudo": req.body.pseudo
	},function(err, friend){console.log("ami modifié");})
}
}
				)
			})			
		});

    })

    db.collection("groups", function(err, groups) {

		app.get('/users/groups', function(req, res) {

		    //groupes non partagé
		    var cursor = groups.find({"membres.0.email": req.session.user.email})
		    //dans le cas du pseudo juste
		    //			var cursor = groups.find({membres: { $all:[req.session.user.pseudo]}})
		    //dans le cas des groupes partagé
		    //			var cursor = groups.find({membres: {$elemMatch: {email:req.session.user.email}}})
		    cursor.toArray(function(err, data) {
			if (err) return next(err)

			var tab=new Array()
			var length = Object.keys(data).length; 
			for (var i = 0; i <length; i++) 
			{	

			    tab[i]= {}
			    tab[i].id = data[i]._id;
			    tab[i].nameGroupe= data[i].nameGroupe;
			    tab[i].membres=new Array();
			    var k=0;
			    var lengthMembres = Object.keys(data[i].membres).length;
			    for (var j = 0; j <lengthMembres; j++) 
			    {

				if(data[i].membres[j].pseudo != req.session.user.pseudo)
				{
				    tab[i].membres[k] = { pseudo: data[i].membres[j].pseudo,
							  email: data[i].membres[j].email
							}
				    k++;
				    
				}  
			    }

			    
			}
			
			res.jsonp(tab)
		    })

		});

		app.post('/users/groups', function(req, res) {
		    if(req.body.membres[j].pseudo.length < 4) return res.json({error:"Nom du groupe trop court"}).end()
		    var lengthMembres = Object.keys(req.body.membres).length;
		    for (var j = 0; j <lengthMembres; j++) 
		    {
			if(req.body.membres[j].pseudo.length < 4) return res.json({error:"Pseudo trop court"}).end()
		    }
		    var Expenses= new Array();
		    groups.insert({nameGroupe:req.body.nameGroupe, membres:req.body.membres , expenses:Expenses}, function(err, groups){
			console.log("Insertion groupe reussie")
			res.json(groups.ops[0]).end()
		    })

		});

		app.post('/users/groups/expenses', function(req, res) {	

			if(req.body.payer == null) return res.json({"error" : "Veuillez saisir tous les champs."})
			if(req.body.balance == null) return res.json({"error" : "Veuillez saisir tous les champs."})

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
		})
    })

	db.collection("friends", function(err, friends) {

		app.post('/users/friends/expenses', function(req, res) {	

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
		})

	});

    app.listen(3000, function() {
		console.log("Server running...")
    })
})