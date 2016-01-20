angular.module("expensesApp").controller("FriendsRemoveController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
	function ($scope, $resource, $rootScope, $cookies, $location, Notification){

		var FriendsRemove = $resource("http://localhost:3000/users/friends/:email");

		$scope.friendsRemove = new FriendsRemove();

		$scope.removeFriend = function(CurrentFri) {
			FriendsRemove.remove({email : CurrentFri.email},function(result){
				if(result.error == null){
					$('#ViewFriend').modal('hide')
					$rootScope.refreshFriends()
				}
			})
		}


	}]);