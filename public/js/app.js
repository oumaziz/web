var app = angular.module("expensesApp", ['ngRoute', 'ngCookies', 'ngResource', 'ngSanitize']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
    .when('/', {templateUrl: 'js/views/login.html', controller: 'LoginController'})
    .when('/register', {templateUrl: 'js/views/register.html', controller: 'RegisterController'})
    .otherwise({redirectTo: '/'});
}]);

app.controller("LoginController", ['$scope', '$resource', '$rootScope', '$cookies', '$location',
  function ($scope, $resource, $rootScope, $cookies, $location){
  $rootScope.currentUser = $cookies.getObject("currentUser");
    if($rootScope.currentUser != null) $rootScope.startWebSocket();

    var Login = $resource("http://localhost:3000/users/login");

    $scope.login = new Login();

    $scope.envoyer = function() {

      $scope.login.$save(function(){
        $rootScope.currentUser = $scope.login;

        var dt = new Date();
        dt.setMinutes(dt.getMinutes() + 30);   

        $cookies.putObject("currentUser", $scope.login, {'expires': dt});
        $location.path('#/home');
        $rootScope.startWebSocket();
      }).catch(function(req){
        Notification.error({message: 'Identifiants incorrects.', positionY: 'bottom', positionX: 'right'});
      });
    }
}]);

app.controller("RegisterController", ['$scope', '$resource', '$rootScope', '$location', function ($scope, $resource, $rootScope, $location){
  var Register = $resource("http://localhost:3000/users/register");
  $scope.register = new Register();

  $scope.envoyer = function() {
      $scope.register.$save(function(){
        $rootScope.currentUser = $scope.register;

        var dt = new Date();
        dt.setMinutes(dt.getMinutes() + 30);  

        $cookies.putObject("currentUser", $scope.register, {'expires': dt});
        $location.path('#/user');
      }).catch(function(req){
        Console.log("Erreur")
      });
    }
}]);

app.controller("BarController", ['$scope', function ($scope){
    
}]);