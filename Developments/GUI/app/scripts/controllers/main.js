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

    var data = [];
    var sel = 0;

    $scope.tempNode = {
      title: '',
      fileName: '',
      fileContent: null
    }

    var currentActiveInputButton = -1;
    var currentArrow;
    var currentShape;
    var currentShapeObj;

    var layer = new Konva.Layer();
    $scope.addBox = function(_x, _y, title, idx, mode) {

      var x = _x;
      var y = _y;

      var destObjIdx = -1;

      var group = new Konva.Group({
          draggable: true,
          dragBoundFunc: (pos) => {
            x = (_x + pos.x);
            y = (_y + pos.y);
            return pos;
          }
      });

      var isInputButtonClicked = false;
      var box = new Konva.Rect({
          x: x,
          y: y,
          width: 100,
          height: 50,
          fill: '#FCFCFC',
          stroke: 'grey',
          strokeWidth: 1.5,
          cornerRadius: 10
      });

      var text = new Konva.Text({
        x: x,
        y: y+10,
        width: 100,
        height: 50,
        text: title,
        fontSize: 12,
        fontFamily: 'Verdana',
        fill: '#555',
        align: 'center'
      })

      var inputCircle = new Konva.Circle({
        x: x + 50,
        y: y,
        width: 10,
        height: 10,
        fill: '#FFF',
        stroke: 'grey',
        strokeWidth: 1.5,
        cornerRadius: 10
      });

      var outputCircle = new Konva.Circle({
        x: x + 50,
        y: y + 50,
        width: 10,
        height: 10,
        fill: '#FFF',
        stroke: 'grey',
        strokeWidth: 1.5,
        cornerRadius: 10
      });


      var arrow = new Konva.Arrow({
        x: x + 50,
        y: y + 50,
        points: [0,0, (x+50) / 2, y / 2],
        pointerLength: 5,
        pointerWidth : 5,
        fill: '#444',
        stroke: '#444',
        strokeWidth: 1.5
      });


      text.on('click', function(e){
        currentShape = 'box';
        currentShapeObj = box;
        currentActiveInputButton = idx;

        var fill = box.stroke() == '#F00' ? 'grey' : '#F00';
        box.stroke(fill);
        layer.draw();
      });

      text.on('mouseover', function() {
        box.fill('#DDD');
        layer.draw();
      });


      text.on('mouseout', function() {
        box.fill('#EEE');
        layer.draw();
      });


      inputCircle.on('mouseover', function() {
        inputCircle.fill('#F00');
        layer.draw();
      });


      inputCircle.on('mouseout', function() {
        inputCircle.fill('#EEE');
        layer.draw();
      });

      outputCircle.on('mouseover', function() {
        outputCircle.fill('#F00');
        layer.draw();
      });


      outputCircle.on('mouseout', function() {
        outputCircle.fill('#EEE');
        layer.draw();
      });

      outputCircle.on('click', function(e) {
        //console.log(boxes[idx]["isInputButtonClicked"], boxes[idx]);
        //boxes[idx]["isInputButtonClicked"] = !(boxes[idx]["isInputButtonClicked"]);
        //console.log(boxes[idx]["isInputButtonClicked"], boxes[idx]);

        currentActiveInputButton = idx;
        currentArrow = arrow;
        //console.log(idx+"move",boxes[idx],stage.getPointerPosition().x+"/"+stage.getPointerPosition().y)
        //console.log(boxes[idx]["isInputButtonClicked"], boxes[idx]);
        console.log("click input");
        if(group.getChildren(c => c === arrow).length === 0){
          console.log("draw");
          var mousePos = stage.getPointerPosition();
          arrow.setAttr('points', [0, 0, mousePos.x - (x + 50), mousePos.y - (y + 50)]);
          group.add(arrow);
          layer.draw();
        }

      });

      arrow.on('click', function(e) {
        currentShape = 'arrow';
        currentShapeObj = arrow;
        console.log("click arrow "+idx);
        //boxes[idx].isInputButtonClicked = !boxes[idx].isInputButtonClicked;

        currentActiveInputButton = idx;
        currentArrow = arrow;
        console.log(idx+"move",boxes[idx],stage.getPointerPosition().x+"/"+stage.getPointerPosition().y)
        if(boxes[currentActiveInputButton].isInputButtonClicked){
          var mousePos = stage.getPointerPosition();
          arrow.setAttr('points', [0, 0, mousePos.x - (x + 50), mousePos.y - (y + 50)]);

          layer.draw();

          //console.log(x, y);
        }

      });

      stage.on('contentClick', function() {
          if(idx !== currentActiveInputButton)  return;
          console.log("contentclick "+ idx);
          boxes[idx].isInputButtonClicked = !boxes[idx].isInputButtonClicked;
      });

      stage.on('contentMousemove', function() {
          if(currentActiveInputButton < 0)  return;
          if(idx !== currentActiveInputButton)  return;

          if(boxes[idx].isInputButtonClicked){
            currentArrow.setAttr('points', [0, 0, stage.getPointerPosition().x - (x + 50), stage.getPointerPosition().y - (y + 50)]);
            //arrow.setAttr('points', [0, 0, e.offsetX - (x + 50), e.offsetY - y]);

            //group.add(currentArrow);


            var xx = currentArrow.x() + currentArrow.points()[2];
            var yy = currentArrow.y() + currentArrow.points()[3];
            console.log(currentArrow.points());


            for(var b of boxes){
              if(b === null || b === undefined)  continue;

              if(b.idx === idx) continue;
              console.log(b.box.x(), xx, b.box.y(), yy);
              if(b.box.x() - 20 < xx && b.box.y() - 20 < yy && xx < b.box.x() + 120 && yy < b.box.y() + 70){
                console.log("in!!");
                destObjIdx = b.idx;
                b.box.stroke('#F00');

              }else{
                destObjIdx = -1;
                b.box.stroke('grey');
              }
            }

            layer.draw();
          }/*else{
            if(destObjIdx !== -1){
              console.log(boxes);
              var newGroup = new Konva.Group({
                  draggable: true,
                  dragBoundFunc: (pos) => {
                    x = (_x + pos.x);
                    y = (_y + pos.y);
                    return pos;
                  }
              });

              var arr = [...boxes[idx].group.getChildren(), boxes[destObjIdx].group.getChildren()]
              console.log(arr);

              for(var c of arr){
                  newGroup.add(c);
                  console.log(newGroup.getChildren());
              }

              console.log(newGroup);

              //boxes[idx].group.removeChildren();
              //boxes[destObjIdx].group.removeChildren();

              boxes[idx].group = boxes[destObjIdx].group = newGroup;
              layer.add(newGroup);

              layer.draw();



              //console.log(boxes[destObjIdx].box.getParent());
            }
          }
*/
      });


      // add cursor styling
      group.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });


      layer.on('dblclick', function() {
          console.log("clicked"+title);
          $scope.tempNode.title = title;
          $scope.tempNode.fileName = data[idx];
          //$("#myModal").modal('show')
          if(boxes[idx].mode === "input"){
            var modalInstance = $uibModal.open({
              templateUrl: 'views/modal/view_input.html',
              controller: function ($scope, $uibModalInstance, $http) {
                $scope.load = function() {
                  if(boxes[idx].title.indexOf('.csv') !== -1){
                    $http({
                        url: "http://localhost:8080/get_file/" + boxes[idx].title,
                        method: "GET"
                    }).success($scope.processData);
                  }
                  $('#datatables-example').DataTable();
                }



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
          }else if(boxes[idx].mode === "tool"){
            var modalInstance = $uibModal.open({
              templateUrl: 'views/modal/view_node.html',
              controller: function ($scope, $uibModalInstance, $http) {

                  $scope.cancel = function () {
                      $uibModalInstance.dismiss('cancel');
                  };
              },
              scope: $scope,
              windowClass: "hmodal-success",
              size: 'lg'
          });
          }

      });
      group.on('mouseout', function() {
          document.body.style.cursor = 'default';
      });

      group.add(box);
      group.add(text);
      group.add(inputCircle);
      group.add(outputCircle);
      layer.add(group);
      stage.add(layer);


      boxes[idx] = {
        title: title,
        idx: idx,
        box: box,
        group: group,
        text: text,
        mode: mode,
        isInputButtonClicked: false
      };
    }

    /*
    $("#whiteboard").mousemove(function(e){
      if(boxes[currentActiveInputButton].isInputButtonClicked){
        //arrow.setAttr('points', [0, 0, stage.getPointerPosition().x - (x + 50), stage.getPointerPosition().y - y]);
        currentArrow.setAttr('points', [0, 0, e.offsetX - (x + 50), e.offsetY - y]);

        group.add(arrow);
        layer.draw();

        console.log(box.x(), box.y(), x, y);
      }
    });*/



    $("#whiteboard").droppable({
      drop: function(event, ui){

        var newPosX = ui.offset.left - $(this).offset().left;
        var newPosY = ui.offset.top - $(this).offset().top;
        var dataset = ui.draggable[0].dataset;
        $scope.addBox(newPosX, newPosY , dataset.title, parseInt(dataset.idx - 1), dataset.mode);
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
