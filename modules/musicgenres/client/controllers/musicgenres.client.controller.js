(function () {
  'use strict';

  // Musicgenres controller
  angular
    .module('musicgenres')
    .controller('MusicgenresController', MusicgenresController);

  MusicgenresController.$inject = ['$scope', '$state', '$window', 'Authentication','Socket', 'musicgenreResolve'];

  function MusicgenresController ($scope, $state, $window, Authentication,Socket, musicgenre) {
    var vm = this;

    vm.authentication = Authentication;
    vm.musicgenre = musicgenre;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Musicgenre
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.musicgenre.$remove($state.go('musicgenres.list'));
      }
    }


    // Save Musicgenre
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.musicgenreForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.musicgenre._id) {
        vm.musicgenre.$update(successCallback, errorCallback);
      } else {
        vm.musicgenre.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('musicgenres.view', {
          musicgenreId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
