angular.module("expensesApp").controller("GroupsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $cookies, $location, Notification){

    var Groups = $resource("http://localhost:3000/users/groups");    

    $scope.groups = new Groups();

    var GroupsUpdate = $resource("http://localhost:3000/users/groups/update");

    $scope.groupsUpdate = new GroupsUpdate();

    $rootScope.refreshGroups = function(){
      var Groups = $resource("http://localhost:3000/users/groups");
      Groups.query(function(result){
        $rootScope.myGroups = result
        $rootScope.initFromFriends()
        $rootScope.initFromGroups()
      })
    }
    
    $rootScope.refreshGroups()

    $scope.MemberNumber = [1,2];
    $scope.groups.membres = [];
    $scope.groups.membres[0] = {
      pseudo:$rootScope.currentUser.pseudo,
      email:$rootScope.currentUser.email

    }
    var addMember= $scope.MemberNumber.length+1;

    $scope.GroupView = function(group) {

      $scope.groupsUpdate.CurrentGroup=group;
      $scope.MemberNumberGroupUpdate=[];
      if($scope.groupsUpdate.CurrentGroup.membres[0].email == $rootScope.currentUser.email ){
        $scope.boole=true;
        for(var k=0; k< $scope.groupsUpdate.CurrentGroup.membres.length-1 ; k++)
        { 
          $scope.MemberNumberGroupUpdate[k]=k+1;
          nbMember=k+1;
          nombre=$scope.groupsUpdate.CurrentGroup.membres.length
          if(nombre>3) $scope.varShow=true; else
          $scope.varShow=false;
        }
      }
      else {  $scope.boole=false;
       Notification.error({message: "Vous ne pouvez pas modifier le groupe", positionY: 'bottom', positionX: 'right'});}
     }

     $scope.addGroup = function() {
      nbMember= nbMember+1
      $scope.MemberNumberGroupUpdate.push(nbMember);
    }

    $scope.removeGroup = function(number) {
      if(nombre> 3){
        var index2 = this.MemberNumberGroupUpdate.indexOf(number);
        this.MemberNumberGroupUpdate.splice(index2, 1);
        nombre--;
        if(nombre>3) $scope.varShow=true; else
        $scope.varShow=false;
      }


    };

    $scope.changePseudo = function(number) {

      for(var j=0; j <$scope.Listefriends.length; j++ ) {
        if($scope.groups.membres[number].pseudo==$scope.Listefriends[j].pseudo) 
          $scope.groups.membres[number].email=$scope.Listefriends[j].email;
      }
    }

    $scope.changePseudoUpdateGroup = function(number) {

      for(var j=0; j <$scope.Listefriends.length; j++ ) {
        if($scope.groupsUpdate.CurrentGroup.membres[number].pseudo==$scope.Listefriends[j].pseudo) 
          $scope.groupsUpdate.CurrentGroup.membres[number].email=$scope.Listefriends[j].email;
      }
    }

    $scope.remove = function(number) {
      var index = this.MemberNumber.indexOf(number);
      this.MemberNumber.splice(index, 1);
    };



    $scope.add = function() {
      $scope.MemberNumber.push(addMember++);
    }

    $scope.updateGroup = function() {
      $scope.groupsUpdate.$save(function(result){

        if(result.error == null){

         $('#ViewGroup').modal('hide')
         $rootScope.refreshGroups()

       }else{
         Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
       }
     }).catch(function(req){
       Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
     });
   }


   $scope.send = function() {

    $scope.groups.$save(function(result){

      if(result.error == null){

        $('#addGroup').modal('hide')
        $rootScope.refreshGroups()

      }else{
        Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
      }
    }).catch(function(req){
      Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
    });
  }

}]);