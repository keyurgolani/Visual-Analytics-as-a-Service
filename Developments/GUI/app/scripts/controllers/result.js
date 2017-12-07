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

      $scope.download = function(result_url) {
          // Download link
    	    // Download link
    	    let downloadLink = document.createElement("a");

    	    // File name

    	    // We have to create a link to the file
    	    downloadLink.href = `http://localhost:8080${result_url}`;

    	    downloadLink.style.display = "none";

    	    document.body.appendChild(downloadLink);

    	    downloadLink.click();
    	    // File name
    	    // We have to create a link to the file

      }

  });
