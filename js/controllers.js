var zenikaRPGApp = angular.module('zenikaRPGApp', []);

zenikaRPGApp.controller('PlayerCtrl', function ($scope, $http) {

  $scope.players = [];

  $http.get('/db/players').then(function(response) {
    $scope.players = response.data.results;
  });

});
