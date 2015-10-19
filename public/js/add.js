var module = angular.module('add', ['index', 'duScroll']);

module.controller('TabCtrl', function($scope, $rootScope) {
	$rootScope.objectClass = 'active';
	$rootScope.placeClass = '';
	$rootScope.typeClass = '';
	$rootScope.subtypeClass = '';
	$rootScope.brandClass = '';

	$scope.selectDiv = function(div) {
		if(div == 'object') {
			$rootScope.objectClass = 'active';
		} else {
			$rootScope.barcode = {
                		'id'  : null,
                		'loc' : null,
                		'tip' : null,
                		'stp' : null,
                		'mar' : null
        		};
			$rootScope.objectClass = '';
		}
		if(div == 'place') {
                        $rootScope.placeClass = 'active';
                } else {
                        $rootScope.placeClass = '';
                }
		if(div == 'type') {
                        $rootScope.typeClass = 'active';
                } else {
                        $rootScope.typeClass = '';
                }
		if(div == 'subtype') {
                        $rootScope.subtypeClass = 'active';
                } else {
                        $rootScope.subtypeClass = '';
                }
		if(div == 'brand') {
                        $rootScope.brandClass = 'active';
                } else {
                        $rootScope.brandClass = '';
                }
	};
});

module.controller('AddObjectCtrl', function($rootScope, $scope, $http, $timeout, $document) {
	$scope.selectedPlace = null;
	$rootScope.places = [];

	$http.get('api/locais').success(function (result) {
		$rootScope.places = result;
	});

	$scope.selectedType = null;
	$rootScope.types = [];

	$http.get('api/tipos').success(function (result) {
                $rootScope.types = result;
        });

	$scope.selectedSubtype = null;
	$rootScope.subtypes = [];

	$scope.updateSubtype = function() {
		$http.get('api/tipos/'+$scope.selectedType).success(function (result) {
			$rootScope.subtypes = result;
		});
	};

	$scope.selectedBrand = null;
	$rootScope.brands = [];

	$http.get('api/marcas').success(function (result) {
		$rootScope.brands = result;
	});

	$scope.resetForm = function() {
		$scope.selectedPlace = null;
		$scope.selectedType = null;
		$scope.selectedSubtype = null;
		$rootScope.subtypes = [];
		$scope.selectedBrand = null;
		$scope.extra = {};
	};

	$scope.recordObject = function() {
		$http.post('api/objecto', {
			'LOC' : parseInt($scope.selectedPlace),
			'TIP' : parseInt($scope.selectedType),
			'STP' : parseInt($scope.selectedSubtype),
			'MAR' : parseInt($scope.selectedBrand),
			'INF' : $scope.extra
		}).success(function (result) {
			$rootScope.messages.push({
                                'text' : 'Object added with success',
                                'type' : 'alert-success',
				'id'   : $rootScope.messageID++
                        });
			$document.scrollTopAnimated(0, 500);
			$scope.resetForm();
		});
	};
});

module.controller('AddPlaceCtrl', function($rootScope, $scope, $http, $document) {
	$scope.resetForm = function() {
		$scope.newPlace = '';
	};
	
	$scope.recordPlace = function() {
		$http.post('/api/local', {
			'LOC' : $scope.newPlace
		}).success(function (result) {
			var nP = {
				'ID'   : parseInt(result),
				'Nome' : $scope.newPlace
			};
                        $rootScope.places.push(nP);
			$rootScope.messages.push({
                                'text' : 'Place added with success',
                                'type' : 'alert-success',
				'id'   : $rootScope.messageID++
                        });
			$document.scrollTopAnimated(0, 500);
			$scope.resetForm();
		});
	};
});

module.controller('AddTypeCtrl', function($rootScope, $scope, $http, $document) {
	$scope.resetForm = function() {
		$scope.newType = '';
	};

	$scope.recordType = function() {
                $http.post('/api/tipo', {
                        'TIP' : $scope.newType
                }).success(function (result) {
			var nT = {
				'ID'   : parseInt(result),
				'Nome' : $scope.newType
			};
                        $rootScope.types.push(nT);
			$rootScope.messages.push({
                                'text' : 'Type added with success',
                                'type' : 'alert-success',
				'id'   : $rootScope.messageID++
                        });
			$document.scrollTopAnimated(0, 500);
			$scope.resetForm();
                });
        };
});

module.controller('AddSubtypeCtrl', function($rootScope, $scope, $http, $document) {
	$scope.selectedType = null;

	$scope.resetForm = function() {
		$scope.selectedType = null;
		$scope.newSubtype = '';
	};

	$scope.recordSubtype = function() {
                $http.post('/api/tipo/'+$scope.selectedType, {
                        'STP' : $scope.newSubtype
                }).success(function (result) {
			$rootScope.messages.push({
                                'text' : 'Subtype added with success',
                                'type' : 'alert-success',
				'id'   : $rootScope.messageID++
                        });
			$document.scrollTopAnimated(0, 500);
			$scope.resetForm();
                });
        };
});

module.controller('AddBrandCtrl', function($rootScope, $scope, $http, $document) {
	$scope.resetForm = function() {
		$scope.newBrand = '';
	};

	$scope.recordBrand = function() {
                $http.post('/api/marca', {
                        'MAR' : $scope.newBrand
                }).success(function (result) {
			var nB = {
				'ID'   : parseInt(result),
				'Nome' : $scope.newBrand
			}; 
			$rootScope.brands.push(nB);
			$rootScope.messages.push({
				'text' : 'Brand added with success',
				'type' : 'alert-success',
				'id'   : $rootScope.messageID++
			});
			$document.scrollTopAnimated(0, 500);
			$scope.resetForm();
                });
        };
});

module.controller('MessageCtrl', function($rootScope, $scope) {
	$rootScope.messages = [];
	$rootScope.messageID = 0;
		
	$scope.closeMessage = function(messageID) {
		var message = null;

		$rootScope.messages.forEach(function (item) {
			if(item.id == messageID) {
				message = item;
			}
		});

		var index = $rootScope.messages.indexOf(message);
		
		if(index > -1) {
			$rootScope.messages.splice(index, 1);
		}
	};
});
