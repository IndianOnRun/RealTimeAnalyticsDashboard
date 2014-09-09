'use strict';

/* Services */

// var csvModule = angular.module('csvModule', []);
// csvModule.factory('Items', ['$http', function($http){
//   var Url   = "pages/brics-mist2.csv";

//   var Items = $http.get(Url).then(function(response){
//      return csvParser(response.data);
//   });
//   return Items;
// }]);

// var csvModule = angular.module('csvModule', []);
// csvModule.factory('Items', ['$http', '$q', function($http, $q){
//   var Url   =  "pages/brics-mist2.csv";

//   var ItemsDefer = $q.defer()
//   $http.get(Url).then(function(response){
//      ItemsDefer.reseolve(csvParser(response.data));
//   });
//   return ItemsDefer.promise;
// }]);

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('json/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);

