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
      first_name:"",
      last_name:"",
      password:"",
      email:""
    }
    $scope.password2 = "";
    $scope.register = function() {
      const {first_name, last_name, user_name, password, email_id} = $scope.userinfo;
      if(password !== $scope.password2){
        alert("Password does not match!");
        return;
      }

      if(first_name === ""){
        alert("First Name is empty!");
        return;
      }

      if(last_name === ""){
        alert("Last Name is empty!");
        return;
      }

      if(password === ""){
        alert("password is empty!");
        return;
      }

      if(email_id === ""){
        alert("Email is empty!");
        return;
      }

      $http({
          url: "user/addUser",
          method: "POST",
          dataType: 'json',
          data: $scope.userinfo
      }).then(function successCallback(response) {
              // this callback will be called asynchronously
              // when the response is available
              //console.log(response.data)


              var __USER_INFO__ = response.data;

              localStorage.setItem("__USER_INFO__", JSON.stringify(__USER_INFO__));

              $state.go('index.main');

            }).catch((error) => {
              alert(error);
            });
    }
  });
