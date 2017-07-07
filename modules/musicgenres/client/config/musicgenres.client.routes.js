(function () {
  'use strict';

  angular
    .module('musicgenres')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('musicgenres', {
        abstract: true,
        url: '/musicgenres',
        template: '<ui-view/>'
      })
      .state('musicgenres.list', {
        url: '',
        templateUrl: 'modules/musicgenres/client/views/list-musicgenres.client.view.html',
        controller: 'MusicgenresListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Musicgenres List'
        }
      })
      .state('musicgenres.create', {
        url: '/create',
        templateUrl: 'modules/musicgenres/client/views/form-musicgenre.client.view.html',
        controller: 'MusicgenresController',
        controllerAs: 'vm',
        resolve: {
          musicgenreResolve: newMusicgenre
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Musicgenres Create'
        }
      })
      .state('musicgenres.edit', {
        url: '/:musicgenreId/edit',
        templateUrl: 'modules/musicgenres/client/views/form-musicgenre.client.view.html',
        controller: 'MusicgenresController',
        controllerAs: 'vm',
        resolve: {
          musicgenreResolve: getMusicgenre
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Musicgenre {{ musicgenreResolve.name }}'
        }
      })
      .state('musicgenres.view', {
        url: '/:musicgenreId',
        templateUrl: 'modules/musicgenres/client/views/view-musicgenre.client.view.html',
        controller: 'MusicgenresController',
        controllerAs: 'vm',
        resolve: {
          musicgenreResolve: getMusicgenre
        },
        data: {
          pageTitle: 'Musicgenre {{ musicgenreResolve.name }}'
        }
      });
  }

  getMusicgenre.$inject = ['$stateParams', 'MusicgenresService'];

  function getMusicgenre($stateParams, MusicgenresService) {
    return MusicgenresService.get({
      musicgenreId: $stateParams.musicgenreId
    }).$promise;
  }

  newMusicgenre.$inject = ['MusicgenresService'];

  function newMusicgenre(MusicgenresService) {
    return new MusicgenresService();
  }
}());
