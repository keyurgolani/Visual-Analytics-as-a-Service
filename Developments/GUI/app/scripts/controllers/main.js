'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('MainCtrl', function ($rootScope, $scope, $state, $uibModal) {
    /*
    $rootScope.script = "";
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

                  $scope.submit = function() {
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.script = $scope.script;
                  }
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
    });



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
*/
$scope.tempNode = {
  title: '',
  fileName: '',
  fileContent: null
}

var $flowchart = $('#flowchart');
$rootScope.flowchart = $flowchart;
    var $container = $flowchart.parent();

    var cx = $flowchart.width() / 2;
    var cy = $flowchart.height() / 2;


    // Panzoom initialization...
    $flowchart.panzoom();

    // Centering panzoom
    $flowchart.panzoom('pan', -cx + $container.width() / 2, -cy + $container.height() / 2);

    // Panzoom zoom handling...
    var possibleZooms = [0.5, 0.75, 1, 2, 3];
    var currentZoom = 2;
    $container.on('mousewheel.focal', function( e ) {
        e.preventDefault();
        var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
        $flowchart.flowchart('setPositionRatio', possibleZooms[currentZoom]);
        $flowchart.panzoom('zoom', possibleZooms[currentZoom], {
            animate: false,
            focal: e
        });
    });



    // Apply the plugin on a standard, empty div...
    $flowchart.flowchart();

    $('.delete_selected_button').click(function() {
      $flowchart.flowchart('deleteSelected');
    });

    $flowchart.on('operatorSelect2', function(el, operatorId, returnHash) {
      var data = $flowchart.flowchart('getData');
      var title = data.operators[operatorId].properties.title.trim();
      var mode = data.operators[operatorId].properties.mode;

      $scope.tempNode.title = title;

      //$("#myModal").modal('show')
      if(mode === "input"){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modal/view_input.html',
          controller: function ($scope, $uibModalInstance, $http) {
            $scope.load = function() {
              if(title.indexOf('.csv') !== -1){
                $http({
                    url: "get_file/" + title,
                    method: "GET"
                }).success($scope.processData);
              }
              $('#datatables-example').DataTable();
            }

            $scope.generateHtmlTable = function(data) {

          		 var html = '<table class="table table-bordered table-striped table-hover table-condensed  text-center" id="DynamicTable">';

                if(typeof(data[0]) === 'undefined') {
                  return null;
                } else {
          		$.each(data, function( index, row ) {
          		  //bind header
          		  if(index == 0) {
            			html += '<thead>';
            			html += '<tr>';
            			$.each(row, function( index, colData ) {
            				html += '<th>';
            				html += colData;
            				html += '</th>';
            			});
            			html += '<th>';
            			html += 'Actions';
            			html += '</th>';
            			html += '</tr>';
            			html += '</thead>';
            			html += '<tbody>';
          		  } else {
            			html += '<tr>';

            			$.each(row, function( index, colData ) {

            				html += '<td>';
            				html += colData;
            				html += '</td>';

            			});
            			html += '</tr>';
          		  }
          		});
          		html += '</tbody>';
          		html += '</table>';
          		$('#csv-display').append(html);
          		$('#DynamicTable').SetEditable({ $addButton: $('#addNewRow')});
          	  }
          	}

            $scope.processData = function(file) {
              data = $.csv.toArrays(file);
              $scope.generateHtmlTable(data);
            };

            $scope.load();

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.save = function(){
              var html = document.querySelector("table").outerHTML;
              $scope.export_table_to_csv(html, title);
            }

            $scope.download_csv = function(csv, filename) {
          	    var csvFile;
          	    var downloadLink;

          	    // CSV FILE
          	    csvFile = new Blob([csv], {type: "text/csv"});

          	    // Download link
          	    downloadLink = document.createElement("a");

                var formData = new FormData();
                formData.append('data_files', csvFile, filename);

                $.ajax({
                       url : 'file_upload',
                       type : 'POST',
                       data : formData,
                       processData: false,  // tell jQuery not to process the data
                       contentType: false,  // tell jQuery not to set contentType
                       success : function(data) {
                           console.log(data);
                           $uibModalInstance.dismiss('cancel');
                       }
                });
          	}

          	$scope.export_table_to_csv = function(html, filename) {
          		var csv = [];
          		var rows = document.querySelectorAll("table tr");

          	    for (var i = 0; i < rows.length; i++) {
          			var row = [], cols = rows[i].querySelectorAll("td, th");

          	        if(i===0){
                      for (var j = 0; j < cols.length - 2; j++){
                        console.log(cols[j].innerText);
            	            row.push(cols[j].innerText);
                        }
                    }else{
                      for (var j = 0; j < cols.length - 1; j++){
                        console.log(cols[j].innerText);
            	            row.push(cols[j].innerText);
                        }
                    }

          			csv.push(row.join(","));
          		}

          	    // Download CSV
          	    $scope.download_csv(csv.join("\n"), filename);
          	}

          },
          scope: $scope,
          windowClass: "hmodal-success",
          size: 'lg'
      });
      }else if(mode === "tool"){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modal/view_node.html',
          controller: function ($scope, $uibModalInstance, $http) {

              $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
              };

              $scope.submit = function() {
                $uibModalInstance.dismiss('cancel');
                //$rootScope.script = $scope.script;
                data.operators[operatorId].properties.script = $scope.script;
              }
          },
          scope: $scope,
          windowClass: "hmodal-success",
          size: 'lg'
      });
      }

     })


    var $draggableOperators = $('.draggable_operator');

    function getOperatorData($element) {
      var nbInputs = parseInt($element.data('nb-inputs'));
      var nbOutputs = parseInt($element.data('nb-outputs'));
      var data = {
        properties: {
          title: $element.text(),
          inputs: {},
          outputs: {}
        }
      };

      var i = 0;
      for (i = 0; i < nbInputs; i++) {
        data.properties.inputs['input_' + i] = {
          label: 'Input ' + (i + 1)
        };
      }
      for (i = 0; i < nbOutputs; i++) {
        data.properties.outputs['output_' + i] = {
          label: 'Output ' + (i + 1)
        };
      }

      return data;
    }

    var operatorId = 0;

    $draggableOperators.draggable({
        cursor: "move",
        opacity: 0.7,

        helper: 'clone',
        appendTo: 'body',
        zIndex: 1000,

        helper: function(e) {
          var $this = $(this);
          var data = getOperatorData($this);
          return $flowchart.flowchart('getOperatorElement', data);
        },
        stop: function(e, ui) {
            var $this = $(this);
            var elOffset = ui.offset;
            var containerOffset = $container.offset();
            if (elOffset.left > containerOffset.left &&
                elOffset.top > containerOffset.top &&
                elOffset.left < containerOffset.left + $container.width() &&
                elOffset.top < containerOffset.top + $container.height()) {

                var flowchartOffset = $flowchart.offset();

                var relativeLeft = elOffset.left - flowchartOffset.left;
                var relativeTop = elOffset.top - flowchartOffset.top;

                var positionRatio = $flowchart.flowchart('getPositionRatio');
                relativeLeft /= positionRatio;
                relativeTop /= positionRatio;

                var data = getOperatorData($this);
                data.left = relativeLeft;
                data.top = relativeTop;

                $flowchart.flowchart('addOperator', data);
            }
        }
    });


  });
