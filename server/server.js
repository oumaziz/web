// On met les variables en global afin quelles puissent
// etre accessible depuis les modules
global.bodyParser = require('body-parser')
global.cookieParser = require('cookie-parser')
global.session = require('express-session')
global.md5 = require("md5")
global.mongo = require("mongodb")

var MongoClient = mongo.MongoClient
var express = require("express")

// Mes modules
var user = require("./user")
var friend = require("./friends")
var group = require("./groups")
var expense = require("./expenses")

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
	global.db = db

    db.collection("users", function(err, users) {
    	global.users = users

		app.post('/users/register', user.add);
		app.post('/users/login', user.connect);
		app.get('/users/logout', user.disconnect);
		app.post('/users/friends', friend.add);
		app.get('/users/friends', friend.show);
		app.delete('/users/friends/:email', friend.remove);
		app.post('/users/friends/update', friend.update);
    })

    db.collection("groups", function(err, groups) {
    	global.groups = groups

		app.get('/users/groups', group.show);
		app.post('/users/groups', group.add);
		app.delete('/users/groups/:idG', group.remove);
		app.post('/users/groups/update', group.update);
		app.post('/users/groups/expenses', expense.group)
    })

    db.collection("friends", function(err, friends) {
    	global.friends = friends

		app.post('/users/friends/expenses', expense.friend)
    });

    app.listen(3000, function() {
		console.log("Server is running...")
    })
})
