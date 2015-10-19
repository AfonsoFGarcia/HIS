var module = angular.module('list', ['index']);

module.controller('ListObjectsCtrl', function($scope, $http, $location) {
	$scope.objects = [];
	$scope.LOC = [];
	$scope.TIP = [];
	$scope.STP = [];
	$scope.MAR = [];

	$http.get('api/locais').success(function(result) {
		$scope.LOC = result;
        });

	$http.get('api/tipos').success(function(result) {
                $scope.TIP = result;
        });

	$http.get('api/subtipos').success(function(result) {
                $scope.STP = result;
        });

	$http.get('api/marcas').success(function(result) {
                $scope.MAR = result;
        });

	$http.get('api/objectos').success(function(result) {
                $scope.objects = result;
        });
	
	$scope.getFromArray = function(object, field) {
		return $scope[field][parseInt(object[field])-1].Nome;
	};

	$scope.getExtraInfo = function(object, field) {
		return object.INF[field];
	};

	$scope.getCompleteID = function(object) {
		return object.LOC + " " + object.TIP + " " + object.STP + " " + object.MAR + " " + object.ID;
	};
	
	$scope.toEdit = function(completeID) {
		return 'update.html?id=' + completeID;
	};
});
