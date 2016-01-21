angular.module("expensesApp").controller("GroupsRemoveController", ['$scope', '$resource', '$rootScope', '$cookies', '$location', 'Notification',
	function ($scope, $resource, $rootScope, $cookies, $location, Notification){

		var GroupsRemove = $resource("http://localhost:3000/users/groups/:idG");

		$scope.groupsRemove = new GroupsRemove();

		$scope.removeGroup = function(CurrentGr) {
			  if (confirm("Vous désirez vraiment supprimer ce groupe?")) {
			GroupsRemove.remove({idG : CurrentGr._id},function(result){
				if(result.error == null){
					$('#ViewGroup').modal('hide')
        			$rootScope.refreshGroups()
				}
			})
		}}


	}]);