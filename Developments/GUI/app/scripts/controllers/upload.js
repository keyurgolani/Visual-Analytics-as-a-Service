'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('UploadCtrl', function ($scope, $http, $state) {
    var myDropzone;
      $scope.dzOptions = {
  		url : 'file_upload',
  		paramName : 'data_files',
  		maxFilesize : '1000',
  		addRemoveLinks : true,
      autoProcessQueue: false,
      maxfilesexceeded: function(file) {
          this.removeAllFiles();
          this.addFile(file);
      },
      init: function(){
        var submitButton = document.querySelector("#submit-all")
          myDropzone = this; // closure
  //alert("init");
      $("#submit-all").click(function() {
        //alert("clicked");
        myDropzone.processQueue(); // Tell Dropzone to process all queued files.
        //$state.go('index.main')
      });

      // You might want to show the submit button only when
      // files are dropped here:
      this.on("addedfile", function() {
        // Show submit button here and/or inform user to click it.
      });
      },
  	};

    //Handle events for dropzone
	//Visit http://www.dropzonejs.com/#events for more events
  var files = [];
	$scope.dzCallbacks = {

		'addedfile' : function(file){
			console.log(file);
			$scope.newFile = file;
		},
		'success' : function(file, xhr){
      console.log(file.name);

      files.push(file);
      console.log(files);
      //fileNames = test1.csv,test2.cv

      //$state.go('index.upload_preview', {'file_name': file.name});
		}
	};

  $scope.goNext = function() {
    var fileNames = "";
    for(var file of files){
      fileNames += (file.name + ",");
    }

    $state.go('index.upload_preview', {'file_name': fileNames, 'seq': 1});
  }

    $scope.dzMethods = {};
  	$scope.removeNewFile = function(){
  		$scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
  	}


  });
