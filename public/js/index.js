var module = angular.module('index', []);

module.controller('InformationCtrl', function ($scope) {
	$scope.address = '';
});

module.directive('navBar', function() {
	return {
		templateUrl:'common/navbar.html',
		controller: 'InformationCtrl'
	};
});
