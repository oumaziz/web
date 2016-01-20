var app = angular.module("expensesApp", ['ngRoute', 'ngCookies', 'ngResource', 'ngSanitize', 'ui-notification']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/register', {templateUrl: 'js/views/register.html', controller: 'RegisterController'})
    .when('/dashboard', {templateUrl: 'js/views/dashboard.html', controller: 'DashboardController'})
    .when('/dashboard/friends', {templateUrl: 'js/views/friends.html', controller: 'FriendsController'})
    .when('/dashboard/groups', {templateUrl: 'js/views/groups.html', controller: 'GroupsController'})
    .when('/dashboard/friend/:email', {templateUrl: 'js/views/accountFriend.html', controller: 'FriendAccountController'})
    .when('/', {templateUrl: 'js/views/login.html', controller: 'LoginController'})
    .otherwise({redirectTo: '/'});
}]);

app.controller("FriendAccountController", ['$scope', '$resource', '$rootScope', '$routeParams', '$cookies', '$location', 'Notification',
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

app.controller("ExpensesManagerController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
   function ($scope, $resource, $rootScope, $cookies, $location, Notification){

    $rootScope.owe = []
    $rootScope.owed = []

    $rootScope.initFromFriends = function(){
        for (var i = 0; i < $rootScope.Listefriends.length; i++) {
            $rootScope.owe.push({"user":$rootScope.Listefriends[i].pseudo, "email":$rootScope.Listefriends[i].email,"expenses":[]})
            $rootScope.owed.push({"user":$rootScope.Listefriends[i].pseudo, "email":$rootScope.Listefriends[i].email,"expenses":[]})

            for (var j = 0; j < $rootScope.Listefriends[i].expenses.length; j++) {
                if($rootScope.Listefriends[i].expenses[j].payer != $rootScope.currentUser.email)
                    $rootScope.owed[i].expenses.push({
                        "amount":$rootScope.Listefriends[i].expenses[j].owe,
                        "description":$rootScope.Listefriends[i].expenses[j].description
                    })
                else
                    $rootScope.owe[i].expenses.push({
                        "amount":$rootScope.Listefriends[i].expenses[j].owe,
                        "description":$rootScope.Listefriends[i].expenses[j].description
                    })
            };
        };
    }

    $rootScope.insertExpenseFromGroup = function(expense, position, state){

        var found = false

        if(state == true){
            for (var i = 0; i < expense.balance.length; i++) {
                found = false
                
                if(expense.balance[i].user != $rootScope.currentUser.email){
                    for (var j = 0; j < $rootScope.owe.length; j++) {
                        if($rootScope.owe[j].email == expense.balance[i].user){
                            $rootScope.owe[j].expenses.push({
                                "amount":expense.balance[i].owe,
                                "description":expense.description
                            })

                            found = true
                            break
                        }
                    };

                    if(!found){
                        $rootScope.owe.push({
                            "user":$rootScope.getMembre($rootScope.myGroups[position], expense.balance[i].user), 
                            "email":expense.balance[i].user,
                            "expenses":[{
                                "amount":expense.balance[i].owe,
                                "description":expense.description
                            }]
                        })
                    }
                }
            };
            
        }else{
            for (var i = 0; i < $rootScope.owed.length; i++) {
                if($rootScope.owed[i].email == expense.payer){
                    $rootScope.owed[i].expenses.push({
                        "amount":$rootScope.getOweFromExpense(expense.balance ,$rootScope.currentUser.email),
                        "description":expense.description
                    })

                    found = true
                    break
                }
            };

            if(!found){
                $rootScope.owed.push({
                    "user":$rootScope.getMembre($rootScope.myGroups[position], expense.payer), 
                    "email":expense.payer,
                    "expenses":[{
                        "amount":$rootScope.getOweFromExpense(expense.balance ,$rootScope.currentUser.email),
                        "description":expense.description
                    }]
                })   
            }

        }
    }

    $rootScope.getOweFromExpense = function(balance, email){
        for (var i = 0; i < balance.length; i++) {
            if(balance[i].user == email)
                return balance[i].owe
        };
    }

    $rootScope.getSum = function(expenses){
        var sum = 0

        for (var i = 0; i < expenses.length; i++) {
            sum += expenses[i].amount
        };

        return sum
    }
    
    $rootScope.getMembre = function(group, email){
        var pseudo

        for (var i = 0; i < group.membres.length; i++) {
            if(group.membres[i].email == email){
                pseudo = group.membres[i].pseudo
                break
            }
        };

        return pseudo
    }

    $rootScope.initFromGroups = function(){
        for (var i = 0; i < $rootScope.myGroups.length; i++) {
            for (var j = 0; j < $rootScope.myGroups[i].expenses.length; j++) {
                if($rootScope.myGroups[i].expenses[j].payer != $rootScope.currentUser.email)
                    $rootScope.insertExpenseFromGroup($rootScope.myGroups[i].expenses[j], i, false)
                else
                    $rootScope.insertExpenseFromGroup($rootScope.myGroups[i].expenses[j], i, true)
            };
        };
    }

}]);


app.controller("DashboardController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
   function ($scope, $resource, $rootScope, $cookies, $location, Notification){

       if($rootScope.currentUser == null) $location.path('/');

   }]);

    app.controller("GroupsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
    function ($scope, $resource, $rootScope, $cookies, $location, Notification){
        var Groups = $resource("http://localhost:3000/users/groups");

        $scope.groups = new Groups();

        var GroupsUpdate = $resource("http://localhost:3000/users/groups/update");

        $scope.groupsUpdate = new GroupsUpdate();

        Groups.query(function(result){

            $scope.Listegroups = result;
            $rootScope.myGroups = result
            $rootScope.initFromGroups()
        })


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

             location.reload(); 

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

            location.reload();

        }else{
            Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
        }
    }).catch(function(req){
        Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
    });
}

}]);
app.controller("FriendsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
 function ($scope, $resource, $rootScope, $cookies, $location, Notification){

     var Friends = $resource("http://localhost:3000/users/friends");

     $scope.friends = new Friends();

     var FriendsUpdate = $resource("http://localhost:3000/users/friends/update");

     $scope.friendsUpdate = new FriendsUpdate();

     Friends.query(function(result){

         $rootScope.Listefriends = result;
         $rootScope.initFromFriends()
     })
     $scope.FriendView = function(friend) {
        $scope.friendsUpdate.CurrentFriend=friend;

    }

    $scope.envoyer = function() {

     $scope.friends.$save(function(result){

         if(result.error == null){

             location.reload(); 

         }else{
             Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
         }
     }).catch(function(req){
         Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
     });
 }


 $scope.update = function() {
    $scope.friendsUpdate.$save(function(result){

        if(result.error == null){

         location.reload(); 

     }else{
         Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
     }
 }).catch(function(req){
     Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
 });
}






}]);


app.controller("FriendsRemoveController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
   function ($scope, $resource, $rootScope, $cookies, $location, Notification){

      var FriendsRemove = $resource("http://localhost:3000/users/friends/:email");

      $scope.friendsRemove = new FriendsRemove();

      $scope.removeFriend = function(CurrentFri) {
       FriendsRemove.remove({email : CurrentFri.email},function(result){
          if(result.error == null){
           location.reload(); }
       })
   }


}]);


app.controller("GroupsRemoveController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
   function ($scope, $resource, $rootScope, $cookies, $location, Notification){

      var GroupsRemove = $resource("http://localhost:3000/users/groups/:idG");

      $scope.groupsRemove = new GroupsRemove();

      $scope.removeGroup = function(CurrentGr) {
       GroupsRemove.remove({idG : CurrentGr._id},function(result){
          if(result.error == null){
           location.reload(); }
       })
   }


}]);

app.controller("FriendsUpdateController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
   function ($scope, $resource, $rootScope, $cookies, $location, Notification){

       var FriendsUpdate = $resource("http://localhost:3000/users/friends/update");

       $scope.friendsUpdate = new FriendsUpdate();
       $scope.CurrentF =$rootScope.CurrentFriend;
       $scope.update = function() {
        $scope.friendsUpdate.$save(function(result){

            if(result.error == null){

             location.reload(); 

         }else{
             Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
         }
     }).catch(function(req){
         Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
     });
 }


}]);


app.controller("LoginController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
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

app.controller("RegisterController", ['$scope', '$resource', '$cookies', '$rootScope', '$location', 'Notification',
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

app.controller("BarController", ['$scope', '$rootScope', '$resource', '$location', '$cookies', 
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

app.controller("GroupExpensesController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $cookies, $location, Notification){

    var Expense = $resource("http://localhost:3000/users/groups/expenses");
    $scope.expense = new Expense();
    $scope.expense.cut = "parts égales"
    $scope.expense.balance = []
    $scope.expense.payer = ""


    $scope.getPayers = function(){
        for (var i = $rootScope.myGroups.length - 1; i >= 0; i--) {
            if($rootScope.myGroups[i]._id == $scope.expense.groupe)
                return $rootScope.myGroups[i].membres
        };
    }

    $scope.getBalance = function(cost){
        var balance = []
        var cost = $scope.expense.cost
        var players = $scope.getPayers()

        for (var i = players.length - 1; i >= 0; i--) {
            balance.push({"user":players[i], "owe":cost / players.length})
        };

        return balance
    }

    $scope.getTotal = function(){
        var total = 0

        for (var i = $scope.expense.balance.length - 1; i >= 0; i--) {
            total += $scope.expense.balance[i].owe
        };

        return (total == null)?0:total
    }

    $scope.getEmail = function(pseudo){
        for (var i = $scope.payers.length - 1; i >= 0; i--) {
            if($scope.payers[i].pseudo == pseudo)
                return $scope.payers[i].email
        };
    }

    $scope.changeCut = function(){
        if($scope.expense.cut == "parts égales") {
            $scope.expense.cut = "parts non égales"
            $scope.expense.balance = $scope.getBalance()
            $scope.detail = true
        }else {
            $scope.expense.cut = "parts égales"
            $scope.expense.balance = $scope.getBalance()
            $scope.detail = false
        }
    }

    $scope.add = function(){
        if($scope.expense.groupe != null){
            if(($scope.expense.payer != null) && ($scope.expense.payer.length > 0)){
                var stop = false 

                console.log("Le payeur est  : "+$scope.expense.payer)

                if(($scope.expense.cost - $scope.getTotal()) != 0){
                    Notification.error({message: "Veuillez vérifier les montants des parts.", positionY: 'bottom', positionX: 'right'});
                    stop = true
                }    

                if(!stop)
                    $scope.expense.$save(function(result){
                        if(result.error == null)
                            Notification.success({message: "Ajout reussi", positionY: 'bottom', positionX: 'right'});
                        else
                            Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});

                        $scope.expense.cut = "parts égales"
                        $scope.expense.balance = []

                    }).catch(function(req){
                        Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
                    });
                }else{
                    Notification.error({message: "Veuillez définir le payeur", positionY: 'bottom', positionX: 'right'});
                }
            }else{
                Notification.error({message: "Veuillez selectionner un groupe", positionY: 'bottom', positionX: 'right'});
            }
        }

    }])


app.controller("FriendExpensesController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
  function ($scope, $resource, $rootScope, $cookies, $location, Notification){

    var Expense = $resource("http://localhost:3000/users/friends/expenses");
    $scope.expense = new Expense();
    $scope.expense.payerText = "Vous"
    $scope.expense.cut = "parts égales"

    $scope.changePayer = function(){
        if($scope.expense.payerText == "Vous") 
            $scope.expense.payerText = "Votre ami"
        else 
            $scope.expense.payerText = "Vous"
    }

    $scope.changeCut = function(){
        if($scope.expense.cut == "parts égales") {
            $scope.expense.cut = "parts non égales"
            $scope.detail = true
        }else {
            $scope.expense.cut = "parts égales"
            $scope.detail = false
        }
    }

    $scope.add = function(){
        if($scope.expense.friend != null){
            var stop = false 

            if($scope.expense.payerText == "Vous") 
                $scope.expense.payer = $rootScope.currentUser.email
            else    
                $scope.expense.payer = $scope.expense.friend

            if($scope.expense.cut == "parts égales") 
                $scope.expense.owe = $scope.expense.cost / 2;
            else {
                if(($scope.expense.cost - ($scope.expense.you + $scope.expense.owe)) != 0){
                    Notification.error({message: "Veuillez vérifier les montants des parts.", positionY: 'bottom', positionX: 'right'});
                    stop = true
                }    
            }

            if(!stop)
                $scope.expense.$save(function(result){
                    if(result.error == null)
                        Notification.success({message: "Ajout reussi", positionY: 'bottom', positionX: 'right'});
                    else
                        Notification.error({message: result.error, positionY: 'bottom', positionX: 'right'});
                    
                    $scope.expense.payerText = "Vous"
                    $scope.expense.cut = "parts égales"

                }).catch(function(req){
                    Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
                });
            }
        }

    }])