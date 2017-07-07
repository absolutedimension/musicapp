// Musictracks service used to communicate Musictracks REST endpoints
(function () {
  'use strict';

  var PAGINATION_TOTAL = 'pagination-total-elements';
  var PAGINATION_SIZE = 'pagination-size';

  angular
    .module('musictracks')
    .factory('MusictracksService', MusictracksService).service();

  MusictracksService.$inject = ['$resource'];

  function MusictracksService($resource) {
    return $resource('v1/tracks/:musictrackId', {
      musictrackId: '@_id'
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
