angular.module("expensesApp").controller("FriendExpensesController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
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

            $('#addFriendDepense').modal('hide')
            $rootScope.refreshFriends()

          }).catch(function(req){
            Notification.error({message: "Une erreur s'est produite", positionY: 'bottom', positionX: 'right'});
          });
        }
      }

    }])