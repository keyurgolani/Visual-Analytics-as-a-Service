'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $state) {
    $scope.fbLogin = function(){
          FB.login(function (response) {
              // handle the response
              if (response.status === 'connected') {
                  // Logged into your app and Facebook.

                  FB.api('/me?fields=email,first_name,last_name,location,bio,birthday,gender,picture,link,timezone,work', function (fb_userinfo) {
                      //console.log(response2);
                      //alert("Your email is :"+response2.email);
                      FB.api(
                          "/" + fb_userinfo.id + "/picture?type=normal",
                          function (picture) {
                              if (picture && !picture.error) {
                                  /* handle the result */

                                  var email           = (fb_userinfo.email === undefined ? "" : fb_userinfo.email);
                                  var password        = "";
                                  var first_name      = (fb_userinfo.first_name === undefined ? "" : fb_userinfo.first_name);
                                  var last_name       = (fb_userinfo.last_name === undefined ? "" : fb_userinfo.last_name);
                                  var gender          = (fb_userinfo.gender === undefined ? "" : fb_userinfo.gender);
                                  //var birth_date      = (fb_userinfo.birthday === undefined ? "" : fb_userinfo.birthday);
                                  var pic_url         = (picture.data === undefined ? "" : picture.data.url);
                                  var timezone        = $rootScope.browser_tz;
                                  var language        = $rootScope.browser_lang;
                                  //var bio             = (fb_userinfo.bio === undefined ? "" : fb_userinfo.bio);
                                  var job             = 0;
                                  var fb_key          = (fb_userinfo.id);

                                  var __USER_INFO__ = {  email: email, password: password, first_name: first_name,
                                                  last_name: last_name, gender: gender,
                                                  pic_url: pic_url, timezone: timezone, language: language,
                                                  job: job,
                                                  fb_key: fb_key
                                  };

                                  localStorage.setItem("__USER_INFO__", JSON.stringify(__USER_INFO__));

                                  $state.go('index.main');
                              }
                          }
                      );


                  });
              } else if (response.status === 'not_authorized') {
                  alert("not_authorized");

              } else {
                  alert("error");

              }
          }, {scope: 'public_profile,email,'});
    }
  });
