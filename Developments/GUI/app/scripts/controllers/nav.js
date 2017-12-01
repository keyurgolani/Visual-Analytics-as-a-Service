'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 *  MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('NavCtrl', function ($rootScope, $scope, $state, $http, $timeout) {

        $(".draggable").draggable({
        revert : function(event, ui) {
            // on older version of jQuery use "draggable"
            // $(this).data("draggable")
            // on 2.x versions of jQuery use "ui-draggable"
            // $(this).data("ui-draggable")
            $(this).data("uiDraggable").originalPosition = {
                top : 0,
                left : 0
            };
            // return boolean
            return !event;
            // that evaluate like this:
            // return event !== false ? false : true;
        }

        //console.log(localStorage.getItem("__USER_INFO__"));
    });

    $scope.upload = function() {
      $state.go('index.upload');
    }

    $http({
        url: "http://localhost:8080/get_file_list",
        method: "GET"
    }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            //console.log(response.data)
            $scope.fileList = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response.statusText);
    });

    $timeout(function(){
          $(".file_lists").draggable();
      });

    $scope.run = function(){

        

        $scope.evokeWithRouter("filter", 1, $rootScope.script);
    }


    $scope.evokeWithRouter = function(name_function, dataset_id, script) {
        


        /*script = {
            {
                Name:"Map",
                Logic, "Logic"
            },
            {
                Name:"Reduce",
                Logic, "Logic"
            },
            {
            "node": "extractUsingRegex",
            "params": {
                "regex": "",
                "column": ""
            }
        }*/


        // var json =  [
        // {
        //  {
        //      "node": name_function,
        //      "logic": script //TODO: Filter Code to be passed here
        //  },
         
        // ]

        $.ajax({
          type: "POST",
          url: `http://localhost:8080/process/`+dataset_id,
          data: json,
          dataType: "text",
          success: function(response)
          {
            alert(response);
          }
        });
    }


  });