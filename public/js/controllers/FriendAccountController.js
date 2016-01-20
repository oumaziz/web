angular.module("expensesApp").controller("FriendAccountController", ['$scope', '$resource', '$rootScope', '$routeParams', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $routeParams, $cookies, $location, Notification){

    $scope.account = function(email) {
      if($rootScope.currentUser == null) $location.path('/');
      $location.path('/dashboard/friend/'+email); 
      for(var j=0; j <$scope.Listefriends.length; j++ ){
        if(email==$scope.Listefriends[j].email){ 
          $scope.Expenses=$scope.Listefriends[j].expenses;
          $scope.FriendPseudo=$scope.Listefriends[j].pseudo;
          break;
        }
      }
      $rootScope.Expenses=$scope.Expenses;
      $rootScope.FriendPseudo=$scope.FriendPseudo;
    }

  }]);