'use strict';

/**
 * @ngdoc overview
 * @name visualAnalyticsApp
 * @description
 * # visualAnalyticsApp
 *
 * Main module of the application.
 */
angular
  .module('visualAnalyticsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "/views/login.html",
            controller: "LoginCtrl"
        })
        .state('index', {
            abstract: true,
            templateUrl: "/views/common/content.html",
            controller: "AppCtrl"
        })
        .state('index.main', {
            url: "/main",
            parent: 'index',
            abstract: false,
            templateUrl: "/views/main.html",
            controller: "MainCtrl"
        });

        //$qProvider.errorOnUnhandledRejections(false);

        $locationProvider.html5Mode({
            enabled: false, // set HTML5 mode
            requireBase: false // I removed this to keep it simple, but you can set your own base url
        });
  });
