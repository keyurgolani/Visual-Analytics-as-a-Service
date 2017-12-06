'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('ResultCtrl', function ($rootScope, $scope, $http, $state, lodash) {

    $scope.userinfo = angular.fromJson(localStorage.getItem("__USER_INFO__"));
    $http.get(`user/userHistory/${$scope.userinfo.user_id}`)
      .then((r) => {
        if(!lodash.isEmpty(r.data)){
          $scope.userJobHistory = r.data;
        }
      })

  });
