angular.module("expensesApp").controller("FriendsUpdateController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
 function ($scope, $resource, $rootScope, $cookies, $location, Notification){

   var FriendsUpdate = $resource("http://localhost:3000/users/friends/update");

   $scope.friendsUpdate = new FriendsUpdate();
   $scope.CurrentF =$rootScope.CurrentFriend;
   $scope.update = function() {
    $scope.friendsUpdate.$save(function(result){

      if(result.error == null){

       $('#ViewFriend').modal('hide')
       $rootScope.refreshFriends()

     }else{
       Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
     }
   }).catch(function(req){
     Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
   });
 }
}]);