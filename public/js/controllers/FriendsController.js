angular.module("expensesApp").controller("FriendsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
 function ($scope, $resource, $rootScope, $cookies, $location, Notification){

   var Friends = $resource("http://localhost:3000/users/friends");

   $scope.friends = new Friends();

   var FriendsUpdate = $resource("http://localhost:3000/users/friends/update");

   $scope.friendsUpdate = new FriendsUpdate();

   $rootScope.refreshFriends = function(){
    var Friends = $resource("http://localhost:3000/users/friends");
    Friends.query(function(result){
     $rootScope.Listefriends = result;
     $rootScope.initFromFriends()
     $rootScope.initFromGroups()
   })
  }

  $rootScope.refreshFriends()

  $scope.FriendView = function(friend) {
    $scope.friendsUpdate.CurrentFriend=friend;

  }

  $scope.envoyer = function() {

   $scope.friends.$save(function(result){

     if(result.error == null){

       $('#addFriend').modal('hide')
       $rootScope.refreshFriends()

     }else{
       Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
     }
   }).catch(function(req){
     Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
   });
 }

$scope.changePseudo = function(friend) {
       
                                
                 for(var j=0; j <$scope.Listefriends.length; j++ ) {
                                    if(friend.pseudo==$scope.Listefriends[j].pseudo) 
                                         {
                                           friend.pseudo=null;

                                 Notification.error({message: "Ce pseudo existe deja", positionY: 'bottom', positionX: 'right'});
                           
                                         }
                                       
                                }
               

    }

    $scope.changeEmail = function(friend) {
       
                                
                 for(var j=0; j <$scope.Listefriends.length; j++ ) {
                                    if(friend.email==$scope.Listefriends[j].email) 
                                         {
                                           friend.email=null;

                                 Notification.error({message: "Vous êtes déjà ami !!", positionY: 'bottom', positionX: 'right'});
                           
                                         }
                                       
                                }
               

    }
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