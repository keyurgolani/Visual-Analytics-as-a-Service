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
  		url : 'file/file_upload',
  		paramName : 'upload',
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
      files.push(file);

      var formData = new FormData();
      formData.append('upload', file, file.name);
      $.ajax({
             url : 'http://localhost:8080/upload',
             type : 'POST',
             data : formData,
             processData: false,  // tell jQuery not to process the data
             contentType: false,  // tell jQuery not to set contentType
             success : function(data) {
                 console.log(data);
             }
      });
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
