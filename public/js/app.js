var app = angular.module("expensesApp", ['ngRoute', 'ngCookies', 'ngResource', 'ngSanitize', 'ui-notification']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
    .when('/', {templateUrl: 'js/views/login.html', controller: 'LoginController'})
    .when('/register', {templateUrl: 'js/views/register.html', controller: 'RegisterController'})
    .otherwise({redirectTo: '/'});
}]);

app.controller("LoginController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $cookies, $location, Notification){
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
                Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
            }
        }).catch(function(req){
            Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
        });
    }
}]);

app.controller("RegisterController", ['$scope', '$resource', '$cookies', '$rootScope', '$location', 'Notification',
   function ($scope, $resource, $cookies, $rootScope, $location, Notification){

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
                Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
            }

        }).catch(function(req){
            Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
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