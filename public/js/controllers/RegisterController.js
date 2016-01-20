angular.module("expensesApp").controller("RegisterController", ['$scope', '$resource', '$cookies', '$rootScope', '$location', 'Notification',
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