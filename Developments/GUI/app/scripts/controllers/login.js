'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $state, $http) {

    $scope.userinfo = {
      user_name:"",
      password: ""
    }

    $scope.fbLogin = function(){
          FB.login(function (response) {
              // handle the response
              if (response.status === 'connected') {
                  // Logged into your app and Facebook.

                  FB.api('/me?fields=email,first_name,last_name,link', function (fb_userinfo) {

                    const {
                      email_id = "",
                      password = "",
                      first_name = "",
                      last_name = "",
                      id: user_name
                    } = fb_userinfo

                    $scope.userinfo = {
                      user_name,
                      email_id,
                      password,
                      first_name,
                      last_name
                    };

                    $http.post("user/FBlogin", $scope.userinfo)
                    .then(response => {
                      localStorage.setItem("__USER_INFO__", JSON.stringify(response.data));
                      localStorage.setItem("__USER_SCRIPT__", response.data.script);

                      $state.go('index.main');
                    }).catch(error => {
                      alert(error.data);
                    })

                  });
              } else if (response.status === 'not_authorized') {
                  alert("not_authorized");

              } else {
                  alert("error");

              }
          }, {scope: 'public_profile,email,'});
    }

    $scope.login = function() {
      const {user_name, password} = $scope.userinfo;

      if(user_name === ""){
        alert("ID is not entered!");
        return;
      }

      if(password === ""){
        alert("Password is not entered!");
        return;
      }

      $http.post("user/login", $scope.userinfo)
      .then(response => {
        localStorage.setItem("__USER_INFO__", JSON.stringify(response.data));
        localStorage.setItem("__USER_SCRIPT__", response.data.script);

        $state.go('index.main');
      }).catch(error => {
        alert(error.data);
      })
    }
  });
