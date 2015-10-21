var module = angular.module('update', ['index', 'duScroll', 'ngFileUpload']);

module.controller('GetObjectCtrl', function($scope, $rootScope, $http, $location) {
	$rootScope.selectedObject = null;
	$rootScope.backupObject = null;

	var url = $location.absUrl();

	var getParameterByName = function(url, name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(url);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var objectID = getParameterByName(url, 'id');

	var getObjectAux = function(objectID) {
	        var spt = objectID.split(" ");
        	$http.get('api/objecto/'+spt[4]).success(function (result) {
                	$http.get('api/tipos/'+result.TIP).success(function (result) {
                        	$rootScope.subtypes = result;
                	});
                	$rootScope.selectedObject = result;
                	$rootScope.selectedObject.INF = JSON.parse(result.INF);
			$rootScope.backupObject = angular.copy($rootScope.selectedObject);
        	});
	};

	if(objectID) {
                $scope.objectID = objectID;
                getObjectAux(objectID);
        }

	$scope.getObject = function() {
		getObjectAux($scope.objectID);
	};
	
	$scope.resetGetObject = function() {
		$rootScope.selectedObject = null;
		$rootScope.backupObject = null;
		$scope.objectID = '';
	};
});

module.controller('UpdateObjectCtrl', function($scope, $rootScope, $http, $document, Upload) {
	$scope.places = [];

        $http.get('api/locais').success(function (result) {
                $scope.places = result;
        });

	$scope.types = [];

        $http.get('api/tipos').success(function (result) {
                $scope.types = result;
        });

	$rootScope.subtypes = [];

        $scope.updateSubtype = function() {
                $http.get('api/tipos/'+($rootScope.selectedObject.TIP.ID ? $rootScope.selectedObject.TIP.ID : $rootScope.selectedObject.TIP)).success(function (result) {
                        $rootScope.subtypes = result;
                });
        };

	$scope.brands = [];

        $http.get('api/marcas').success(function (result) {
                $scope.brands = result;
        });
	
	$scope.fileSelected = function(files, type) {
		if(files && files.length) {
			$scope[type] = files[0];
			console.log($scope[type]);
		}
	};

	$scope.updateObject = function() {
		var objectToStore = {
			'LOC' : ($rootScope.selectedObject.LOC.ID ? $rootScope.selectedObject.LOC.ID : $rootScope.selectedObject.LOC),
			'TIP' : ($rootScope.selectedObject.TIP.ID ? $rootScope.selectedObject.TIP.ID : $rootScope.selectedObject.TIP),
			'STP' : ($rootScope.selectedObject.STP.ID ? $rootScope.selectedObject.STP.ID : $rootScope.selectedObject.STP),
			'MAR' : ($rootScope.selectedObject.MAR.ID ? $rootScope.selectedObject.MAR.ID : $rootScope.selectedObject.MAR),
			'INF' : $rootScope.selectedObject.INF
		};
		
		$http.put('api/objecto/'+$rootScope.selectedObject.ID, objectToStore).success(function (result) {
			var success = true;

			var uploadFunc = function(path, type) {
				Upload.upload({
                                        url  : '/upload/' + path + '/' + $rootScope.selectedObject.ID,
                                        data : { file : $scope[type] }
                                }).then(function(resp) {
					return true;
                                }, function(resp) {
					return false;
                                });
                                $scope[type] = null;
			};
			
			if($scope.Picture) {
				success = success && uploadFunc('imagem', 'Picture');
			}
			if($scope.Invoice) {
				success = success && uploadFunc('fatura', 'Invoice');
			}
			if(success) {
				$rootScope.messages.push({
                                	'text' : 'Object updated with success',
                                	'type' : 'alert-success',
                                	'id'   : $rootScope.messageID++
                        	});
			} else {
				$rootScope.messages.push({
                                        'text' : 'Object updated with success but there were errors uploading the files',
                                        'type' : 'alert-warning',
                                        'id'   : $rootScope.messageID++
                                });
			}
                        $rootScope.backupObject = angular.copy($rootScope.selectedObject);
                        $document.scrollTopAnimated(0, 500);
		});
	};

	$scope.resetObject = function() {
                $rootScope.selectedObject = angular.copy($rootScope.backupObject);
        }
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
