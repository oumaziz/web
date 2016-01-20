angular.module("expensesApp").controller("BarController", ['$scope', '$rootScope', '$resource', '$location', '$cookies', 
 function ($scope, $rootScope, $resource, $location, $cookies){

   $rootScope.currentUser = $cookies.getObject("currentUser");

   var Logout = $resource("http://localhost:3000/users/logout");

   $scope.deconnexion = function(){
     Logout.get();
     $cookies.remove("currentUser");
     $rootScope.currentUser = null;
     $location.path('#/');
   }

 }]);