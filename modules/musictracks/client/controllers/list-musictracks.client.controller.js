(function () {
  'use strict';

  angular
    .module('musictracks')
    .controller('MusictracksListController', MusictracksListController);

  MusictracksListController.$inject = ['$scope','$http','MusictracksService','Socket'];

  function MusictracksListController($scope,$http,MusictracksService,Socket) {
    var vm = this;

    vm.musictracks = MusictracksService.query();

    vm.chipName = function(chip) {
      return {
        name: chip
      };
    };

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
      vm.musictracks = MusictracksService.query({page:$scope.currentPage});
    };

    $scope.searchTracks =  function(){
      var searchInput = angular.element('#search-input').val();
      $http.get('v1/searchtracks?title='+searchInput).then(function(response){
        vm.musictracks = response.data.results;
      }).catch(function(response){
        console.log("Error in searching :"+response.data);
      });
    }

     //Updating listview by listening web-socket.
    Socket.on('musictrack.updated', function(musictrack) {
        vm.musictracks.push(musicgenre);
    });

     Socket.on('musictrack.deleted', function(musictrack) {
        vm.musictracks.pop(musicgenre);
    });
  }
}());
