angular.module("expensesApp").controller("GroupExpensesController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
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

              $('#addGroupDepense').modal('hide')
              $rootScope.refreshGroups()

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