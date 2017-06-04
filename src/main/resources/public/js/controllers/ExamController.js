angular.module('eObrazovanjeApp').controller(
		'ExamController',
		[
			'$rootScope',
			'$scope',
			'$http',
			'$routeParams',
			'$location',
			function($rootScope, $scope, $http, $routeParams,  $location) {
				$scope.getExam = function(id) {
					$http.get('api/exams/' + id).success(
							function(data, status) {
								$scope.exam = data;
							}).error(function() {
						$scope.redAlert = true;
					});
				};

				$scope.getAllExams = function() {
					$http.get('api/exams/all').success
						(function(data, status) {
							$scope.exams = data;
					}).error(function() {
						alert('Oops, something went wrong!');
					});
					$scope.resetFilter = function() {
					}
				};

				$scope.deleteExam = function(id) {
					$http.delete('api/exams/delete/' + id).success(
							function(data, status) {
								$scope.deleted = data;
								$scope.blueAlert = true;
								$scope.getAllDocuments();

							}).error(function() {
						$scope.redAlert = true;
					});
				};

				$scope.hideAlerts = function() {
					$scope.redAlert = false;
					$scope.blueAlert = false;
					$scope.orangeAlert = false;
				};

				$scope.initExam = function() {
					$scope.exam = {};

					if ($routeParams && $routeParams.id) {
						// ovo je edit stranica
						$http.get('api/exams/' + $routeParams.id).success(
								function(data) {
									$scope.exam = data;
								}).error(function() {
						});
					}
				};

				$scope.saveExam = function() {
					if ($scope.exam.id) {
						// edit stranica
						$http.put('api/exams/edit/' + $scope.exam.id,
								$scope.exam).success(function() {
							$location.path('/exams');
						}).error(function() {
							alert("neka greska edita");
						});
					} else {
						// add stranica
						$http.post('api/exams/add/', $scope.exam).success(
								function() {
									$location.path('/exams/all');
								}).error(function() {
							alert('greska dodavanja!')
						});
					}
				};
			}
		]
);