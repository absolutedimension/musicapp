(function () {
  'use strict';

  describe('Musictracks Route Tests', function () {
    // Initialize global variables
    var $scope,
      MusictracksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MusictracksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MusictracksService = _MusictracksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('musictracks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/musictracks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MusictracksController,
          mockMusictrack;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('musictracks.view');
          $templateCache.put('modules/musictracks/client/views/view-musictrack.client.view.html', '');

          // create mock Musictrack
          mockMusictrack = new MusictracksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Musictrack Name'
          });

          // Initialize Controller
          MusictracksController = $controller('MusictracksController as vm', {
            $scope: $scope,
            musictrackResolve: mockMusictrack
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:musictrackId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.musictrackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            musictrackId: 1
          })).toEqual('/musictracks/1');
        }));

        it('should attach an Musictrack to the controller scope', function () {
          expect($scope.vm.musictrack._id).toBe(mockMusictrack._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/musictracks/client/views/view-musictrack.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MusictracksController,
          mockMusictrack;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('musictracks.create');
          $templateCache.put('modules/musictracks/client/views/form-musictrack.client.view.html', '');

          // create mock Musictrack
          mockMusictrack = new MusictracksService();

          // Initialize Controller
          MusictracksController = $controller('MusictracksController as vm', {
            $scope: $scope,
            musictrackResolve: mockMusictrack
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.musictrackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/musictracks/create');
        }));

        it('should attach an Musictrack to the controller scope', function () {
          expect($scope.vm.musictrack._id).toBe(mockMusictrack._id);
          expect($scope.vm.musictrack._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/musictracks/client/views/form-musictrack.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MusictracksController,
          mockMusictrack;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('musictracks.edit');
          $templateCache.put('modules/musictracks/client/views/form-musictrack.client.view.html', '');

          // create mock Musictrack
          mockMusictrack = new MusictracksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Musictrack Name'
          });

          // Initialize Controller
          MusictracksController = $controller('MusictracksController as vm', {
            $scope: $scope,
            musictrackResolve: mockMusictrack
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:musictrackId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.musictrackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            musictrackId: 1
          })).toEqual('/musictracks/1/edit');
        }));

        it('should attach an Musictrack to the controller scope', function () {
          expect($scope.vm.musictrack._id).toBe(mockMusictrack._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/musictracks/client/views/form-musictrack.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
