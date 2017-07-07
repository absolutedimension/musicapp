(function () {
  'use strict';

  angular
    .module('musictracks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('musictracks', {
        abstract: true,
        url: '/musictracks',
        template: '<ui-view/>'
      })
      .state('musictracks.list', {
        url: '',
        templateUrl: 'modules/musictracks/client/views/list-musictracks.client.view.html',
        controller: 'MusictracksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Musictracks List'
        }
      })
      .state('musictracks.create', {
        url: '/create',
        templateUrl: 'modules/musictracks/client/views/form-musictrack.client.view.html',
        controller: 'MusictracksController',
        controllerAs: 'vm',
        resolve: {
          musictrackResolve: newMusictrack
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Musictracks Create'
        }
      })
      .state('musictracks.edit', {
        url: '/:musictrackId/edit',
        templateUrl: 'modules/musictracks/client/views/form-musictrack.client.view.html',
        controller: 'MusictracksController',
        controllerAs: 'vm',
        resolve: {
          musictrackResolve: getMusictrack
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Musictrack {{ musictrackResolve.name }}'
        }
      })
      .state('musictracks.view', {
        url: '/:musictrackId',
        templateUrl: 'modules/musictracks/client/views/view-musictrack.client.view.html',
        controller: 'MusictracksController',
        controllerAs: 'vm',
        resolve: {
          musictrackResolve: getMusictrack
        },
        data: {
          pageTitle: 'Musictrack {{ musictrackResolve.name }}'
        }
      });
  }

  getMusictrack.$inject = ['$stateParams', 'MusictracksService'];

  function getMusictrack($stateParams, MusictracksService) {
    return MusictracksService.get({
      musictrackId: $stateParams.musictrackId
    }).$promise;
  }

  newMusictrack.$inject = ['MusictracksService'];

  function newMusictrack(MusictracksService) {
    return new MusictracksService();
  }
}());
