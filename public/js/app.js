(function(){ 

  var app = angular.module("expensesApp", ['ngRoute', 'ngCookies', 'ngResource', 'ngSanitize', 'ui-notification']);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/register', {templateUrl: 'js/views/register.html', controller: 'RegisterController'})
    .when('/dashboard', {templateUrl: 'js/views/dashboard.html', controller: 'DashboardController'})
    .when('/dashboard/friends', {templateUrl: 'js/views/friends.html', controller: 'FriendsController'})
    .when('/dashboard/groups', {templateUrl: 'js/views/groups.html', controller: 'GroupsController'})
    .when('/dashboard/friends/:idF', {templateUrl: 'js/views/accountFriend.html', controller: 'FriendAccountController'})
    .when('/dashboard/groups/:idG', {templateUrl: 'js/views/accountGroup.html', controller: 'GroupAccountController'})
    .when('/', {templateUrl: 'js/views/login.html', controller: 'LoginController'})
    .otherwise({redirectTo: '/'});
  }]);

})(); 