angular.module("expensesApp").controller("FriendAccountController", ['$scope', '$resource', '$rootScope', '$routeParams', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $routeParams, $cookies, $location, Notification){

    $scope.membreId= function(email){
      for(var j=0; j <$scope.Listefriends.length; j++ ){
        if(email==$scope.Listefriends[j].email) 
          return $scope.Listefriends[j]._id;
      };
    }

    $scope.account = function(idF) {
      if($rootScope.currentUser == null) $location.path('/');
      $location.path('/dashboard/friends/'+idF); 
      for(var j=0; j <$scope.Listefriends.length; j++ ){
        if(idF==$scope.Listefriends[j]._id){ 
          $rootScope.Expenses=$scope.Listefriends[j].expenses;
          $rootScope.FriendAccount=$scope.Listefriends[j];
          break;
        }
      }    
    }

  }]);