var app = angular.module("expensesApp", ['ngRoute', 'ngCookies', 'ngResource', 'ngSanitize', 'ui-notification']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
	.when('/register', {templateUrl: 'js/views/register.html', controller: 'RegisterController'})
	.when('/dashboard', {templateUrl: 'js/views/dashboard.html', controller: 'DashboardController'})
	.when('/dashboard/friends', {templateUrl: 'js/views/friends.html', controller: 'FriendsController'})
	.when('/dashboard/groups', {templateUrl: 'js/views/groups.html', controller: 'GroupsController'})
	.when('/', {templateUrl: 'js/views/login.html', controller: 'LoginController'})
	.otherwise({redirectTo: '/'});
}]);

app.controller("DashboardController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
				       function ($scope, $resource, $rootScope, $cookies, $location, Notification){
					  
					   if($rootScope.currentUser == null) $location.path('/');

					   console.log("dans le dash")    

				       }]);

app.controller("GroupsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
				    function ($scope, $resource, $rootScope, $cookies, $location, Notification){
					var Groups = $resource("http://localhost:3000/users/groups");

					$scope.groups = new Groups();

					Groups.query(function(result){

					    $scope.Listegroups = result;
					})
					$scope.MemberNumber = [1,2];
					$scope.groups.membres = [];
					$scope.groups.membres[0] = {
					    pseudo:$rootScope.currentUser.pseudo,
					    email:$rootScope.currentUser.email

					   }
					var addMember= $scope.MemberNumber.length+1;

					$scope.changePseudo = function(number) {

					    for(var j=0; j <$scope.Listefriends.length; j++ ) {
						if($scope.groups.membres[number].pseudo==$scope.Listefriends[j].pseudo) 
						    $scope.groups.membres[number].email=$scope.Listefriends[j].email;
					    }
					}
					
					
					
					

					$scope.add = function() {
					    $scope.MemberNumber.push(addMember++);
					}

					$scope.send = function() {

					    $scope.groups.$save(function(result){
						
						if(result.error == null){

						    location.reload();

						}else{
						    Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
						}
					    }).catch(function(req){
						Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
					    });
					}

				    }]);

app.controller("FriendsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
				     function ($scope, $resource, $rootScope, $cookies, $location, Notification){

					 var Friends = $resource("http://localhost:3000/users/friends");

					 $scope.friends = new Friends();

					   Friends.query(function(result){

					       $rootScope.Listefriends = result;
					   })
					 

					 $scope.envoyer = function() {

					     $scope.friends.$save(function(result){

						 if(result.error == null){

 						     location.reload(); 
						     
						 }else{
						     Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
						 }
					     }).catch(function(req){
						 Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
					     });
					 }
				     }]);

app.controller("LoginController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
				   function ($scope, $resource, $rootScope, $cookies, $location, Notification){

				       if($rootScope.currentUser != null) $location.path('/dashboard');

				       var Login = $resource("http://localhost:3000/users/login");

				       $scope.login = new Login();

				       $scope.envoyer = function() {

					   $scope.login.$save(function(result){

					       if(result.error == null){
						   $rootScope.currentUser = result;

						   var dt = new Date();
						   dt.setMinutes(dt.getMinutes() + 30);   

						   $cookies.putObject("currentUser", $scope.login, {'expires': dt});
						   $location.path('/dashboard');
					       }else{
						   Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
					       }
					   }).catch(function(req){
					       Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
					   });
				       }
				   }]);

app.controller("RegisterController", ['$scope', '$resource', '$cookies', '$rootScope', '$location', 'Notification',
				      function ($scope, $resource, $cookies, $rootScope, $location, Notification){

					  if($rootScope.currentUser != null) $location.path('/dashboard');

					  var Register = $resource("http://localhost:3000/users/register");
					  $scope.register = new Register();

					  $scope.envoyer = function() {
					      $scope.register.$save(function(result){

						  if(result.error == null){
						      $rootScope.currentUser = result;

						      var dt = new Date();
						      dt.setMinutes(dt.getMinutes() + 30);  

						      $cookies.putObject("currentUser", $scope.register, {'expires': dt});
						      $location.path('#/dashboard');
						  }else{
						      Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
						  }

					      }).catch(function(req){
						  Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
					      });
					  }
				      }]);

app.controller("BarController", ['$scope', '$rootScope', '$resource', '$location', '$cookies', 
				 function ($scope, $rootScope, $resource, $location, $cookies){

				     $rootScope.currentUser = $cookies.getObject("currentUser");

				     var Logout = $resource("http://localhost:3000/users/logout");

				     $scope.deconnexion = function(){
					 Logout.get();
					 console.log("deco");
					 $cookies.remove("currentUser");
					 $rootScope.currentUser = null;
					 $location.path('#/');
				     }

				 }]);
