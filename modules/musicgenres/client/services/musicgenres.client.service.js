// Musicgenres service used to communicate Musicgenres REST endpoints
(function () {
  'use strict';

  angular
    .module('musicgenres')
    .factory('MusicgenresService', MusicgenresService);

  MusicgenresService.$inject = ['$resource'];

  function MusicgenresService($resource) {
    return $resource('v1/genres/:musicgenreId', {
      musicgenreId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
                method: 'GET', 
                isArray:true, 
                transformResponse : function(data, headers) {
                   var jsonData = JSON.parse(data);
                    return jsonData.results;
             }
         }
    });
  }
}());
