angular.module('eObrazovanjeApp').controller(
		'SubjectController',
		[
				'$rootScope',
				'$scope',
				'$http',
				'$routeParams',
				'$location',
				'authService',
				function($rootScope, $scope, $http, $routeParams, authService, $location) {
					$rootScope.userId = localStorage.getItem('userId');
					$scope.getUserSubjects = function() {
							$http.get('api/subjects/getFor/' + $routeParams.id).success
							(function(data, status) {
								$scope.subjects = data;
							}).error(function() {
							alert('Oops, something went wrong!');
						});
					};
					

					
					$scope.getStudentsNotInSubject = function() {
						$scope.tempSubjectDTO={};
						$http.get('api/subjects/getNotInSubject/' + $routeParams.id).success
						(function(data, status) {
							$scope.students = data;
							$scope.tempSubjectDTO.studentsDTO=[];
						}).error(function() {
						alert('Oops, something went wrong!');
					});
				};
					$scope.takeSubjectId = function(subjectId){
						$rootScope.subjectId=subjectId;
					};
					
					
					$scope.getStudentsInSubject = function() {
						$http.get('api/students/getStudentsInSubject/' + $routeParams.id).success
						(function(data, status) {
							$scope.students = data;
						}).error(function() {
						alert('Oops, something went wrong!');
					});
				};
					
					
					
					$scope.getSubject = function(id) {
						$http.get('api/subjects/' + id).success(
								function(data, status) {
									$scope.subject = data;

								}).error(function() {
							$scope.redAlert = true;

						});
					};
					$scope.pageNumber = 0;
					
					$scope.getAllSubjects = function() {
						$http.get('api/subjects', {
							params: {
								"text": $scope.text,
								"pageNumber": $scope.pageNumber

							}
						}).success
							(function(data, status) {
								$scope.subjects = data.content;
								$scope.pageNum = data.number + 1;
				                $scope.pageNumMax = data.totalPages;

						}).error(function() {
							alert('Oops, something went wrong!');
						});

						$scope.resetFilter = function() {

						}
					};
					


					$scope.deleteSubject = function(id) {
						$http.delete('api/subjects/delete/' + id).success(
								function(data, status) {
									$scope.deleted = data;
									$scope.blueAlert = true;
									$scope.getAllSubjects();

								}).error(function() {
							$scope.redAlert = true;

						});
					};

					$scope.hideAlerts = function() {
						$scope.redAlert = false;
						$scope.blueAlert = false;
						$scope.orangeAlert = false;
					};
					
					$scope.initSubject = function() {
						$scope.subject = {};

						if ($routeParams && $routeParams.id) {
							// ovo je edit stranica
							$http.get('api/subjects/' + $routeParams.id).success(
									function(data) {
										$scope.subject = data;
									}).error(function() {

							});
						}
					};

					$scope.saveSubject = function() {
						if ($scope.subject.id) {
							// edit stranica
							$http.put('api/subjects/edit/' + $scope.subject.id,
									$scope.subject).success(function() {
									window.location ="#/subjects";

							}).error(function() {
								alert("Editing error!");
							});
						} else {
							// add stranica
							$http.post('api/subjects/add/', $scope.subject).success(
									function() {
										window.location ="#/subjects";
									}).error(function() {
								alert('Error while adding!')
							});
						}
					};
					
					
					$scope.addStudentsToSubject = function() {
							$http.post('api/subjects/addStudentToSubject/'+ $routeParams.id, $scope.tempSubjectDTO).success(
									function() {
										var poruka ="uspesno ste dodali : "
										for ( var i in $scope.tempSubjectDTO.studentsDTO) {
											poruka+=$scope.tempSubjectDTO.studentsDTO[i].name+ ' '+$scope.tempSubjectDTO.studentsDTO[i].lastName+',  '
										}
										alert(poruka);
										window.location ="#/subjects";
									}).error(function() {
								alert('Error while adding!')
							});
						
					};
					$scope.addStudentToSubject = function(student) {
						$scope.tempSubjectDTO.studentsDTO.push(student);
						var index = $scope.students.indexOf(student);
						$scope.students.splice(index,1);
				};

				$scope.removeFromList = function(student) {
					var index = $scope.tempSubjectDTO.studentsDTO.indexOf(student);
					$scope.tempSubjectDTO.studentsDTO.splice(index, 1);


				};
					// paginacija
					$scope.previousPage = function () {
						if ($scope.pageNumber != 0) {
							$scope.pageNumber = $scope.pageNumber - 1;
						}
						$http.get('api/subjects', {
							params: {
								"pageNumber": $scope.pageNumber

							}
						}).success
							(function(data, status) {
								$scope.subjects = data.content;
								$scope.pageNum = data.number + 1;

						}).error(function() {
							alert('Oops, something went wrong!');
						});

					};
					$scope.firstPage = function () {
						$scope.pageNumber = 0;

						$http.get('api/subjects', {
							params: {
								"pageNumber": $scope.pageNumber

							}
						}).success
							(function(data, status) {
								$scope.subjects = data.content;
								$scope.pageNum = data.number + 1;

						}).error(function() {
							alert('Oops, something went wrong!');
						});

					};
					$scope.nextPage = function () {
						if ($scope.pageNumber + 1 < $scope.pageNumMax) {
							$scope.pageNumber = $scope.pageNumber + 1;
						}
						$http.get('api/subjects', {
							params: {
								"pageNumber": $scope.pageNumber

							}
						}).success
							(function(data, status) {
								$scope.subjects = data.content;
								$scope.pageNum = data.number + 1;

						}).error(function() {
							alert('Oops, something went wrong!');
						});
					};
					$scope.lastPage = function () {
						$scope.pageNumber = $scope.pageNumMax - 1;
						$http.get('api/subjects', {
							params: {
								"pageNumber": $scope.pageNumber

							}
						}).success
							(function(data, status) {
								$scope.subjects = data.content;
								$scope.pageNum = data.number + 1;

						}).error(function() {
							alert('Oops, something went wrong!');
						});
					};
				} ]);