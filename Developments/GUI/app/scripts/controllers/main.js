'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('MainCtrl', function ($scope, $state, $uibModal) {

    var boxes = [];
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

    var cnt = 0;

    var data = Array(100);
    var sel = 0;

    $scope.tempNode = {
      title: '',
      fileName: '',
      fileContent: null
    }

    $scope.addBox = function(x, y, title, idx) {

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

      boxes.push({
        box: box,
        text: text
      })
      // add cursor styling
      group.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });

      layer.on('click', function() {

        var fill = box.fill() == '#EEE' ? 'white' : '#EEE';
        var stroke = box.stroke() === 'red' ? 'gray' : 'red';
        var strokeWidth = box.strokeWidth() === 0.5 ? 1 : 0.5

        box.fill(fill);
        box.stroke(stroke);
        box.strokeWidth(strokeWidth);
        layer.draw();
      });

      layer.on('dblclick', function() {
          console.log("clicked"+title);
          $scope.tempNode.title = title;
          $scope.tempNode.fileName = data[idx];
          //$("#myModal").modal('show')
          var modalInstance = $uibModal.open({
            templateUrl: 'views/modal/view_node.html',
            controller: function ($scope, $uibModalInstance, $http) {
              $scope.load = function() {
                if(data[idx].indexOf('.csv') !== -1){
                  $http({
                      url: "http://localhost:8080/get_file/" + data[idx],
                      method: "GET"
                  }).success($scope.processData);
                }
              }

              $('#datatables-example').DataTable();

              $scope.processData = function(allText) {
                  // split content based on new line
                  var allTextLines = allText.split(/\r\n|\n/);
                  var headers = allTextLines[0].split(',');
                  console.log(headers)
                  var lines = [];

                  for ( var i = 0; i < allTextLines.length; i++) {
                      // split content based on comma
                      var data = allTextLines[i].split(',');
                      if (data.length == headers.length) {
                          var tarr = [];
                          for ( var j = 0; j < headers.length; j++) {
                              tarr.push(data[j]);
                          }
                          lines.push(tarr);
                      }
                  }
                  console.log(lines);
                  $scope.tempNode.fileContent = lines;
              };

              $scope.load();
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            scope: $scope,
            windowClass: "hmodal-success",
            size: 'lg'
        });
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
        var dataset = ui.draggable[0].dataset;
        //console.log(dataset.title, dataset.idx);
        data[dataset.idx] = dataset.title;
        $scope.addBox(newPosX, newPosY , dataset.title, dataset.idx)
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
