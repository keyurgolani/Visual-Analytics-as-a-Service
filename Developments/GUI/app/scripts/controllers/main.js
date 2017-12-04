'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('MainCtrl', function ($rootScope, $scope, $state, $uibModal, $http, lodash) {
$scope.tempNode = {
  title: '',
  fileName: '',
  fileContent: null
}

$rootScope.params = {
  regex: '',
  column: '',
  interleave: false,
  start: 0,
  end: 0,
  delimiter: '',
  parameter: '',
  value: '',
  target_column: 0,
  toType: '',
  at: 0,
  indexes: '',
  operation: '',
  aggregation: '',
  ascending: false,
  n: 0,
  replace: false
}

$rootScope.output = {
  limit: 10,
  isSorted:false
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
    const script = angular.fromJson(angular.fromJson(localStorage.getItem("__USER_INFO__")).script);
    $flowchart.flowchart({
      data: lodash.isEmpty(script) ? {} : script
    });

    $('.delete_selected_button').click(function() {
      $flowchart.flowchart('deleteSelected');
    });

    $('.delete_all_button').click(() => {
      $flowchart.flowchart('setData', {});
    })

    $flowchart.on('linkCreate', function(linkId, linkData) {
      var data = $rootScope.flowchart.flowchart('getData');
      $http.post('user/updateScript', {
        script: JSON.stringify(data),
        user_id: $rootScope.userinfo.user_id
      });
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
                    url: "file/get_file/" + title,
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
              $scope.script = $rootScope.script;
              $scope.params = $rootScope.params;
              $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
              };

              $scope.submit = function() {
                $uibModalInstance.dismiss('cancel');
                //$rootScope.script = $scope.script;
                console.log($scope.params);
                data.operators[operatorId].properties.script = $scope.script;
                data.operators[operatorId].properties.params = $scope.params;
                $flowchart.flowchart('setData', data);

                $rootScope.script = $scope.script;
                $rootScope.params = $scope.params;
              }
          },
          scope: $scope,
          windowClass: "hmodal-success",
          size: 'lg'
      });
    }else if(mode === "output"){

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modal/view_output.html',
          controller: function ($scope, $uibModalInstance, $http) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.submit = function() {
              $uibModalInstance.dismiss('cancel');
              //$rootScope.script = $scope.script;
              data.operators[operatorId].properties.limit = $scope.output.limit;
              data.operators[operatorId].properties.isSorted = $scope.output.isSorted;
              $flowchart.flowchart('setData', data);

              $rootScope.output = $scope.output;
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
