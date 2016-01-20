angular.module("expensesApp").controller("LoginController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
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