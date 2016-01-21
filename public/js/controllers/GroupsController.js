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
    var nombre;
     $scope.groups.membres = [];
        $scope.groups.membres[0] = {
            pseudo:$rootScope.currentUser.pseudo,
            email:$rootScope.currentUser.email

        }

         $scope.groups.membres[1] = {
            pseudo:null,
            email:null

        }

         $scope.groups.membres[2] = {
            pseudo:null,
            email:null

        }

    $scope.GroupView = function(group) {
$scope.groupsUpdate.CurrentGroup=group;
        if($scope.groupsUpdate.CurrentGroup.membres[0].email == $rootScope.currentUser.email ){
            $scope.boole=true;
            nombre=$scope.groupsUpdate.CurrentGroup.membres.length
              
              if(nombre>3) $scope.varShow=true; else
                 $scope.varShow=false;
                
            }
            else {  $scope.boole=false;
             Notification.error({message: "Vous ne pouvez pas modifier le groupe", positionY: 'bottom', positionX: 'right'});}
        
     }

     $scope.addGroup = function() {
     $scope.groupsUpdate.CurrentGroup.membres.push({});
            nombre++;
            if(nombre>3) $scope.varShow=true; else
            $scope.varShow=false;
    }

    $scope.removeGroup = function(group) {
    
    if(nombre> 3){
            var index2 = $scope.groupsUpdate.CurrentGroup.membres.indexOf(group);
            
            $scope.groupsUpdate.CurrentGroup.membres.splice(index2,1)
            nombre--;
            if(nombre>3) $scope.varShow=true; else
            $scope.varShow=false;
        } else {
            Notification.error({message: "il faut au moin 2 membres", positionY: 'bottom', positionX: 'right'});
        }
  
 
      

    };

    $scope.changePseudo = function(membre) {
        var temp=true;
            var temp2=true;
            for(var i=0; i < $scope.groups.membres.length; i++ ) {
                        if($scope.groups.membres[i]!=membre){
                             if($scope.groups.membres[i].pseudo == membre.pseudo && membre.pseudo!=null){
                                temp=false
                                membre.pseudo=null;

                                 Notification.error({message: "Ce pseudo existe deja", positionY: 'bottom', positionX: 'right'});
                             }

                     }
                 }


                if(temp==true) {
                                
                 for(var j=0; j <$scope.Listefriends.length; j++ ) {
                                    if(membre.pseudo==$scope.Listefriends[j].pseudo) 
                                         {membre.email=$scope.Listefriends[j].email;
                                            temp2=false
                                         }
                                       
                                }
                }

                if(temp2==true)  membre.email=null
    }


    
     $scope.changeEmail = function(membre) {
           
           for(var i=0; i < $scope.groups.membres.length; i++ ) {
                        if($scope.groups.membres[i]!=membre && membre.email!= null){
                        
                         if($scope.groups.membres[i].email ==membre.email) membre.email=null;
                     }
                         }
            
        }

    $scope.changePseudoUpdateGroup = function(member) {

     
             var temp=true;
            var temp2=true;
            for(var i=0; i < $scope.groupsUpdate.CurrentGroup.membres.length; i++ ) {
                        if($scope.groupsUpdate.CurrentGroup.membres[i]!=member){
                             if($scope.groupsUpdate.CurrentGroup.membres[i].pseudo == member.pseudo){
                                temp=false
                                 Notification.error({message: "Ce pseudo existe deja", positionY: 'bottom', positionX: 'right'});
                                 member.pseudo=null;
                             }

                     }
                 }


                if(temp==true) {
                                
                 for(var j=0; j <$scope.Listefriends.length; j++ ) {
                                    if(member.pseudo==$scope.Listefriends[j].pseudo) 
                                         {member.email=$scope.Listefriends[j].email;
                                            temp2=false
                                         }
                                       
                                }
                }

                if(temp2==true)  member.email=null

            
    }

    $scope.remove = function(membre) {
      var index3 = $scope.groups.membres.indexOf(membre);
        $scope.groups.membres.splice(index3,1)
    };



    $scope.add = function() {
     $scope.groups.membres.push({});
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