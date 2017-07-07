(function () {
  'use strict';

  angular
    .module('musicgenres')
    .controller('MusicgenresListController', MusicgenresListController);

  MusicgenresListController.$inject = ['$scope','MusicgenresService','$timeout','Socket'];

  function MusicgenresListController($scope,MusicgenresService,$timeout,Socket) {
    var vm = this;
    $scope.currentPage = 1;

    vm.musicgenres = MusicgenresService.query();

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
      vm.musicgenres = MusicgenresService.query({page:$scope.currentPage});   
    };
      
    //Updating listview by listening web-socket.
    Socket.on('musicgenre.created', function(musicgenre) {
        vm.musicgenres.push(musicgenre);
    });

     Socket.on('musicgenre.updated', function(musicgenre) {
        vm.musicgenres.push(musicgenre);
    });
     Socket.on('musicgenre.deleted', function(musicgenre) {
        vm.musicgenres.pop(musicgenre);
    });
  }
}());
