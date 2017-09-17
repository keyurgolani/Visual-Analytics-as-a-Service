'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('MainCtrl', function ($scope) {

    $scope.init = function() {
      var width = window.innerWidth;
    var height = window.innerHeight;

    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });
    var dragLayer = new Konva.Layer();
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
    var colorIndex = 0;
    var layersArr = [];
    /*
    * create 10 layers each containing 1000 shapes to create
    * 10,000 shapes.  This greatly improves performance because
    * only 1,000 shapes will have to be drawn at a time when a
    * circle is removed from a layer rather than all 10,000 shapes.
    * Keep in mind that having too many layers can also slow down performance.
    * I found that using 10 layers each made up of 1,000 shapes performs better
    * than 20 layers with 500 shapes or 5 layers with 2,000 shapes
    */
    var layer = new Konva.Layer();
    layersArr.push(layer);
    addCircle(layer);
    stage.add(layer);
    stage.add(dragLayer);
    stage.on('mousedown', function(evt) {
        var circle = evt.target;
        var layer = circle.getLayer();
        circle.moveTo(dragLayer);
        layer.draw();
        circle.startDrag();
    });
    }

    $scope.addCircle = function(layer){
      var color = colors[colorIndex++];
      if(colorIndex >= colors.length) {
          colorIndex = 0;
      }
      var randX = Math.random() * stage.getWidth();
      var randY = Math.random() * stage.getHeight();
      var circle = new Konva.Circle({
          x: randX,
          y: randY,
          radius: 6,
          fill: color
      });
      layer.add(circle);
    }

    $scope.addInput = function() {

    }

    $scope.init();
  });
