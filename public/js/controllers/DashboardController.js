angular.module("expensesApp").controller("DashboardController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
 function ($scope, $resource, $rootScope, $cookies, $location, Notification){

   if($rootScope.currentUser == null) $location.path('/');

 }]);