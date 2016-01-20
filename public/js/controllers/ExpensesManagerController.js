angular.module("expensesApp").controller("ExpensesManagerController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
 function ($scope, $resource, $rootScope, $cookies, $location, Notification){

  $rootScope.initFromFriends = function(){

    $rootScope.owe = []
    $rootScope.owed = []

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

  $rootScope.getOweTotal = function(){
    var total = 0

    if($rootScope.owe != null)
      for (var i = 0; i < $rootScope.owe.length; i++) {
        total += $rootScope.getSum($rootScope.owe[i].expenses)
      };

      return total
    }

    $rootScope.getOwedTotal = function(){
      var total = 0

      if($rootScope.owed != null)
        for (var i = 0; i < $rootScope.owed.length; i++) {
          total += $rootScope.getSum($rootScope.owed[i].expenses)
        };

        return total
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
        if($rootScope.myGroups != null)
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