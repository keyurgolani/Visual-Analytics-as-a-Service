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
    var width = window.innerWidth;
    var height = window.innerHeight;

    var stage = new Konva.Stage({
        container: 'whiteboard',
        width: width,
        height: height
    });
    var dragLayer = new Konva.Layer();

    var colorIndex = 0;
    var layersArr = [];
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];


    var rectX = stage.getWidth() / 2 - 50;
    var rectY = stage.getHeight() / 2 - 25;

    $scope.tempNode = {
      title: ''
    }

    $scope.addBox = function(x, y, title) {
      var layer = new Konva.Layer();
      var group = new Konva.Group({
        draggable: true
    });
      var box = new Konva.Rect({
          x: x,
          y: y,
          width: 100,
          height: 50,
          fill: '#FFF',
          stroke: 'grey',
          strokeWidth: 0.5,
          cornerRadius: 10
      });

      var text = new Konva.Text({
        x: x,
        y: y,
        width: 100,
        height: 50,
        text: title,
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: '#555',
        align: 'center'
      })
      // add cursor styling
      group.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });

      layer.on('click', function() {
          console.log("clicked"+title);
          $scope.tempNode.title = title;
          $("#myModal").modal('show')
      });
      group.on('mouseout', function() {
          document.body.style.cursor = 'default';
      });

      group.add(box);
      group.add(text);
      layer.add(group);
      stage.add(layer);
    }


    $("#whiteboard").droppable({
      drop: function(event, ui){

        var newPosX = ui.offset.left - $(this).offset().left;
        var newPosY = ui.offset.top - $(this).offset().top;
        console.log(ui.draggable[0].dataset.title)
        $scope.addBox(newPosX, newPosY , ui.draggable[0].dataset.title)
        $(".draggable").animate({
          top : 0,
          left : 0
        }, 'fast')
      }
    })

    $scope.save = function() {
      var json = stage.toJSON()
      console.log(json);
    }

  });
