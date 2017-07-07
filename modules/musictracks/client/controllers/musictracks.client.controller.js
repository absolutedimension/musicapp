(function () {
  'use strict';

  // Musictracks controller
  angular
    .module('musictracks')
    .controller('MusictracksController', MusictracksController);

  MusictracksController.$inject = ['$scope', '$state', '$window','$timeout', 'Authentication', 'musictrackResolve','MusicgenresService'];

  function MusictracksController ($scope, $state, $window,$timeout, Authentication, musictrack,MusicgenresService,musicgenre) {
    var vm = this;

    vm.authentication = Authentication;
    vm.musictrack = musictrack;
    vm.musicgenre = musicgenre;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.querySearch = querySearch;
    vm.filterSelected = true
    
   
    
    if(vm.musictrack._id){
       vm.genreList = vm.musictrack.genre;
       $timeout(populateGenres,500);
      
    } else {
       vm.genreList = MusicgenresService.query();
       $timeout(populateGenres,500);
       vm.genres = [];
    }

    function populateGenres(){
      vm.loadGenres = loadGenres();
      if(vm.musictrack._id) {
        var tempArray = [];
        vm.genres = tempArray.concat(vm.loadGenres);
      } else {
        vm.genres = [];
      }
         
    }

    
    function querySearch (criteria) {
      return criteria ? vm.loadGenres.filter(createFilterFor(criteria)) : [];
    }

   function loadGenres() {    
      var genres = vm.genreList;
      return genres;
       return genres.map(function (c, index) {
        var genre = {
          name:c.name
        }
        genre.name = genre.name.toLowerCase();
        return genre;
      });
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(genre) {
        var lowercaseGenreName = genre.name.toLowerCase();
        return (genre.name.toLowerCase().indexOf(lowercaseQuery) != -1);
      };
    }
     



    // Remove existing Musictrack
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.musictrack.$remove($state.go('musictracks.list'));
      }
    }

    // Save Musictrack
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.musictrackForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.musictrack._id) {
        vm.musictrack.$update(successCallback, errorCallback);
      } else {
        vm.musicgenre = vm.genres;
        vm.musictrack.genre = vm.musicgenre;
        //alert("Before save :"+JSON.stringify(vm.genres));
        vm.musictrack.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('musictracks.view', {
          musictrackId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
