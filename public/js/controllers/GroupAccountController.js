angular.module("expensesApp").controller("GroupAccountController", ['$scope', '$resource', '$rootScope', '$routeParams', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $routeParams, $cookies, $location, Notification){

    $scope.pseudo= function(email){
      for(var j=0; j <$scope.Listefriends.length; j++ ){
        if(email==$scope.Listefriends[j].email) 
          return $scope.Listefriends[j].pseudo;
      };

      for(var j=0; j < $scope.myGroups.length; j++ ){
        for (var i = 0; i < $scope.myGroups[j].membres.length; i++) {
          if($scope.myGroups[j].membres[i].email == email)
            return $scope.myGroups[j].membres[i].pseudo
        };
      };
    }

    $scope.accountGroup = function(idG) {
      if($rootScope.currentUser == null) $location.path('/');
      $location.path('/dashboard/groups/'+idG); 
      for(var j=0; j <$scope.myGroups.length; j++ ){
        if(idG==$scope.myGroups[j]._id){
          $rootScope.GroupExpenses=$scope.myGroups[j].expenses; 
          $rootScope.GroupAccount=$scope.myGroups[j];
          break;
        }
      };
    }

  }]);