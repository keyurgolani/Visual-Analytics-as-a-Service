'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('RegisterCtrl', function ($http, $scope, $rootScope, $state) {
    $scope.userinfo = {
      firstName:"",
      lastName:"",
      password:"",
      password2:"",
      email:""
    }
    $scope.register = function() {
      const {firstName, lastName, password, password2, email} = $scope.userinfo;
      if(password !== password2){
        alert("Password does not match!");
        return;
      }

      if(firstName === ""){
        alert("First Name is empty!");
        return;
      }

      if(lastName === ""){
        alert("Last Name is empty!");
        return;
      }

      if(password === ""){
        alert("password is empty!");
        return;
      }

      if(email === ""){
        alert("Email is empty!");
        return;
      }

      $http({
          url: "user/addUser",
          method: "POST",
          dataType: 'json',
          data: JSON.stringify($scope.userinfo)
      }).then(function successCallback(response) {
              // this callback will be called asynchronously
              // when the response is available
              //console.log(response.data)
              $scope.fileList = response.data;
              response.data.forEach((file, idx) => {
                  $("#inputFileList")
                    .append(`<li class="primary-submenu draggable_operator" data-nb-inputs="0" data-nb-outputs="1" data-title="${file.name}" data-idx="${idx + 7}" data-mode="input" ><a href="#">
                      <div>
                        <div class="nav-label" style="z-index:10000;">${file.name}</div>
                      </div>
                    </a>
                    </li>`)

              })
            });
    }
  });
