var app = angular.module("expensesApp", ['ngRoute', 'ngCookies', 'ngResource', 'ngSanitize', 'ui-notification']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/register', {templateUrl: 'js/views/register.html', controller: 'RegisterController'})
    .when('/dashboard', {templateUrl: 'js/views/dashboard.html', controller: 'DashboardController'})
    .when('/dashboard/friends', {templateUrl: 'js/views/friends.html', controller: 'FriendsController'})
    .when('/dashboard/groups', {templateUrl: 'js/views/groups.html', controller: 'GroupsController'})
    .when('/', {templateUrl: 'js/views/login.html', controller: 'LoginController'})
    .otherwise({redirectTo: '/'});
}]);

app.controller("DashboardController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
                       function ($scope, $resource, $rootScope, $cookies, $location, Notification){
                       
                       if($rootScope.currentUser == null) $location.path('/');

                       console.log("dans le dash")    

                       }]);

app.controller("GroupsController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
                    function ($scope, $resource, $rootScope, $cookies, $location, Notification){
                    var Groups = $resource("http://localhost:3000/users/groups");

                    $scope.groups = new Groups();

                    Groups.query(function(result){

                        $scope.Listegroups = result;
                        $rootScope.myGroups = result
                    })

                    
                    $scope.MemberNumber = [1,2];
                    $scope.groups.membres = [];
                    $scope.groups.membres[0] = {
                        pseudo:$rootScope.currentUser.pseudo,
                        email:$rootScope.currentUser.email

                    }
                    var addMember= $scope.MemberNumber.length+1;

                    $scope.changePseudo = function(number) {

                        for(var j=0; j <$scope.Listefriends.length; j++ ) {
                        if($scope.groups.membres[number].pseudo==$scope.Listefriends[j].pseudo) 
                            $scope.groups.membres[number].email=$scope.Listefriends[j].email;
                        }
                    }
                    
                    $scope.remove = function(number) {
                        var index = this.MemberNumber.indexOf(number);
                        this.MemberNumber.splice(index, 1);
                    };
                    
                    

                    $scope.add = function() {
                        $scope.MemberNumber.push(addMember++);
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

                     Friends.query(function(result){

                         $rootScope.Listefriends = result;
                     })
                     $scope.FriendView = function(friend) {
                        $scope.CurrentFriend=friend;

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

                       var FriendsUpdate = $resource("http://localhost:3000/users/friends/update");

                           $scope.friendsUpdate = new FriendsUpdate();
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
                     console.log("deco");
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
            if($rootScope.myGroups[i].id == $scope.expense.groupe)
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

            if($scope.expense.payer == "Vous") 
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