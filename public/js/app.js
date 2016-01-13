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

      var Login = $resource("http://localhost:3000/users/login");

      $scope.login = new Login();

      $scope.envoyer = function() {

          $scope.login.$save(function(result){

            if(result.error == null){
                $rootScope.currentUser = result;

                var dt = new Date();
                dt.setMinutes(dt.getMinutes() + 30);   

                $cookies.putObject("currentUser", $scope.login, {'expires': dt});
                $location.path('#/user');
            }else{
                console.log(result.error)
            }
        }).catch(function(req){
            console.log("Erreur")
        });
    }
}]);

app.controller("RegisterController", ['$scope', '$resource', '$cookies', '$rootScope', '$location',
   function ($scope, $resource, $cookies, $rootScope, $location){

      var Register = $resource("http://localhost:3000/users/register");
      $scope.register = new Register();

      $scope.envoyer = function() {
        $scope.register.$save(function(result){

            if(result.error == null){
                $rootScope.currentUser = result;

                var dt = new Date();
                dt.setMinutes(dt.getMinutes() + 30);  

                $cookies.putObject("currentUser", $scope.register, {'expires': dt});
                $location.path('#/user');
            }else{
                console.log(result.error)
            }

        }).catch(function(req){
            console.log("Une erreur s'est produite")
        });
    }
}]);

app.controller("BarController", ['$scope', '$rootScope', '$resource', '$location', '$cookies', 
    function ($scope, $rootScope, $resource, $location, $cookies){

        var Logout = $resource("http://localhost:3000/users/logout");

        $scope.deconnexion = function(){
            Logout.get();
            console.log("deco");
            $cookies.remove("currentUser");
            $rootScope.currentUser = null;
            $location.path('#/');
        }

    }]);